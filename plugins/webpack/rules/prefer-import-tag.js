import fs from "node:fs";
import path from "node:path";
import { collectImportTags, stripLineMarkers } from "../utils/import-tags.js";

// A `@typedef` that is nothing but an import — `{import("m")}` or `{import("m").Name}`
// — and carries no description. Anything richer (a generic instantiation, an indexed
// access, an intersection) cannot be written as `@import`, so it is left alone.
const PLAIN_IMPORT_TYPEDEF =
	/@typedef[ \t]*\{[ \t]*import\((["'])([^"']+)\1\)(?:\.([A-Za-z_$][\w$]*))?[ \t]*\}[ \t]+([A-Za-z_$][\w$]*)[ \t]*(?=\r?\n|$)/g;

// Probed in TypeScript's resolution order; a `.ts` source is written as `.js`,
// since TypeScript rejects a `.ts` path unless `allowImportingTsExtensions` is on
const CANDIDATES = [
	[".ts", ".js"],
	[".d.ts", ".d.ts"],
	[".js", ".js"],
];

const RELATIVE_REQUEST = /^\.\.?(?:\/|$)/;

/**
 * @param {string} file absolute path
 * @returns {boolean} true when a file (not a directory) is there
 */
const isFile = (file) => {
	try {
		return fs.statSync(file).isFile();
	} catch {
		return false;
	}
};

/**
 * Finds the extension a relative request that names no file as written needs.
 * @param {string} directory directory of the linted file
 * @param {string} request relative module request as written
 * @returns {string | undefined} the request with its extension, or undefined when nothing matches
 */
const resolveWithExtension = (directory, request) => {
	const absolute = path.resolve(directory, request);

	if (isFile(absolute)) {
		return undefined;
	}

	for (const [prefix, base] of [
		["", absolute],
		["/index", path.join(absolute, "index")],
	]) {
		for (const [extension, written] of CANDIDATES) {
			if (isFile(`${base}${extension}`)) {
				return `${request.replace(/\/$/, "")}${prefix}${written}`;
			}
		}
	}

	return undefined;
};

/**
 * @param {string} moduleRequest module the type comes from
 * @param {string | undefined} exportName named export, or undefined for the whole module
 * @param {string} alias local name the type is bound to
 * @returns {string} the equivalent `@import` comment
 */
const buildImportComment = (moduleRequest, exportName, alias) => {
	const binding =
		exportName === undefined
			? alias
			: `{ ${exportName === alias ? alias : `${exportName} as ${alias}`} }`;

	return `/** @import ${binding} from ${JSON.stringify(moduleRequest)} */`;
};

/**
 * @type {import("eslint").Rule.RuleModule} rule rule
 */
export const rule = {
	create(context) {
		const { sourceCode, filename } = context;
		const [{ extension = "ignore" } = {}] =
			/** @type {[{ extension?: "always" | "ignore" }?]} */ (context.options);
		// Without a real file name there is no directory to resolve against
		const directory =
			extension === "always" && path.isAbsolute(filename)
				? path.dirname(filename)
				: undefined;

		/**
		 * @param {string} request module request as written
		 * @returns {string | undefined} the request with its extension, when it lacks one
		 */
		const withExtension = (request) =>
			directory === undefined || !RELATIVE_REQUEST.test(request)
				? undefined
				: resolveWithExtension(directory, request);

		return {
			"Program:exit"() {
				for (const tag of collectImportTags(sourceCode)) {
					const request = tag.moduleRequest;
					const fixed = withExtension(request);

					if (fixed === undefined) {
						continue;
					}

					// `end` sits just past the closing quote of the request
					const requestStart = tag.end - 1 - request.length;

					context.report({
						loc: {
							start: sourceCode.getLocFromIndex(requestStart),
							end: sourceCode.getLocFromIndex(tag.end - 1),
						},
						messageId: "missingExtension",
						data: { request, fixed },
						fix: (fixer) =>
							fixer.replaceTextRange([requestStart, tag.end - 1], fixed),
					});
				}

				for (const comment of sourceCode.getAllComments()) {
					if (comment.type !== "Block" || !comment.value.startsWith("*")) {
						continue;
					}

					const commentRange = /** @type {[number, number]} */ (comment.range);
					const body = stripLineMarkers(comment.value);

					PLAIN_IMPORT_TYPEDEF.lastIndex = 0;

					let match;

					while ((match = PLAIN_IMPORT_TYPEDEF.exec(body)) !== null) {
						const [text, , moduleRequest, exportName, alias] = match;
						const start = commentRange[0] + 2 + match.index;
						// Only a comment holding this tag and nothing else can be swapped
						// in place; lifting one tag out of a block is left to the author
						const isWholeComment =
							!comment.value.includes("\n") && body.trim() === text.trim();

						context.report({
							loc: {
								start: sourceCode.getLocFromIndex(start),
								end: sourceCode.getLocFromIndex(start + text.length),
							},
							messageId: "preferImportTag",
							data: { alias },
							fix: isWholeComment
								? (fixer) =>
										fixer.replaceTextRange(
											commentRange,
											buildImportComment(
												withExtension(moduleRequest) || moduleRequest,
												exportName,
												alias,
											),
										)
								: null,
						});
					}
				}
			},
		};
	},
	meta: {
		docs: {
			description:
				"Require `@import` rather than a `@typedef` that only aliases an `import()`",
			recommended: false,
		},
		fixable: "code",
		messages: {
			preferImportTag:
				"`{{alias}}` aliases an `import()`; declare it with `@import` instead of `@typedef`.",
			missingExtension: 'Write "{{request}}" with its extension: "{{fixed}}".',
		},
		schema: [
			{
				type: "object",
				properties: {
					extension: {
						description:
							"`always` requires a relative `@import` path to name its file with the extension",
						enum: ["always", "ignore"],
					},
				},
				additionalProperties: false,
			},
		],
		type: "suggestion",
	},
};
