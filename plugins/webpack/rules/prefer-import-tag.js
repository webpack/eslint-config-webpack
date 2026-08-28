import { stripLineMarkers } from "../utils/import-tags.js";

// A `@typedef` that is nothing but an import — `{import("m")}` or `{import("m").Name}`
// — and carries no description. Anything richer (a generic instantiation, an indexed
// access, an intersection) cannot be written as `@import`, so it is left alone.
const PLAIN_IMPORT_TYPEDEF =
	/@typedef[ \t]*\{[ \t]*import\((["'])([^"']+)\1\)(?:\.([A-Za-z_$][\w$]*))?[ \t]*\}[ \t]+([A-Za-z_$][\w$]*)[ \t]*(?=\r?\n|$)/g;

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
		const { sourceCode } = context;

		return {
			"Program:exit"() {
				for (const comment of sourceCode.getAllComments()) {
					if (comment.type !== "Block" || !comment.value.startsWith("*")) {
						continue;
					}

					const range = /** @type {[number, number]} */ (comment.range);
					const body = stripLineMarkers(comment.value);

					PLAIN_IMPORT_TYPEDEF.lastIndex = 0;

					let match;

					while ((match = PLAIN_IMPORT_TYPEDEF.exec(body)) !== null) {
						const [text, , moduleRequest, exportName, alias] = match;
						const start = range[0] + 2 + match.index;
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
											range,
											buildImportComment(moduleRequest, exportName, alias),
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
			category: "Stylistic Issues",
			description:
				"Require `@import` rather than a `@typedef` that only aliases an `import()`",
			recommended: true,
		},
		fixable: "code",
		messages: {
			preferImportTag:
				"`{{alias}}` aliases an `import()`; declare it with `@import` instead of `@typedef`.",
		},
		schema: [],
		type: "suggestion",
	},
};
