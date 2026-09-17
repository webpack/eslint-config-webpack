/** @typedef {import("estree").Comment} Comment */
/** @typedef {import("estree").Program} Program */
/** @typedef {import("estree").Statement | import("estree").ModuleDeclaration} ProgramEntry */
/** @typedef {import("eslint").AST.SourceLocation} SourceLocation */
/** @typedef {Comment & { range: [number, number], loc: SourceLocation }} LocatedComment */

const DEFAULT_MAX = 3;
const MARKER = /^[ \t]*WHY:/;

/**
 * A directive such as `"use strict"` documents how the file is parsed rather
 * than what it does, so it does not end the preamble.
 * @param {ProgramEntry} node statement to test
 * @returns {boolean} whether the statement is a directive prologue entry
 */
const isDirective = (node) =>
	node.type === "ExpressionStatement" &&
	typeof (/** @type {{ directive?: string }} */ (node).directive) === "string";

/**
 * @param {LocatedComment} comment comment to test
 * @returns {boolean} whether the comment is a JSDoc block
 */
const isJsdoc = (comment) =>
	comment.type === "Block" && comment.value.startsWith("*");

/** @type {import("eslint").Rule.RuleModule} rule rule */
export const rule = {
	create(context) {
		const { sourceCode } = context;
		const { max = DEFAULT_MAX } = context.options[0] || {};

		/**
		 * @param {LocatedComment} start first comment of the run
		 * @param {number} endLine last line the run covers
		 * @returns {void}
		 */
		const check = (start, endLine) => {
			const lines = endLine - start.loc.start.line + 1;

			if (lines <= max) return;

			context.report({
				loc: { start: start.loc.start, end: { line: endLine, column: 0 } },
				messageId: "tooLong",
				data: { lines: String(lines), max: String(max) },
			});
		};

		return {
			"Program:exit"(program) {
				// Every comment above the first statement documents the file, like the
				// license header, so the limit does not apply to any of them
				const first = /** @type {Program} */ (program).body.find(
					(node) => !isDirective(node),
				);
				const preambleEnd = first
					? /** @type {{ range: [number, number] }} */ (first).range[0]
					: Number.MAX_SAFE_INTEGER;

				/** @type {LocatedComment | undefined} */
				let start;
				let endLine = 0;
				let exempt = false;

				for (const comment of /** @type {LocatedComment[]} */ (
					sourceCode.getAllComments()
				)) {
					const before = sourceCode.getTokenBefore(comment, {
						includeComments: true,
					});
					const ownLine = before?.loc?.end.line !== comment.loc.start.line;

					if (comment.type !== "Line" || !ownLine) {
						if (start && !exempt) check(start, endLine);
						start = undefined;

						if (
							comment.type === "Block" &&
							ownLine &&
							!isJsdoc(comment) &&
							comment.range[0] >= preambleEnd
						) {
							check(comment, comment.loc.end.line);
						}

						continue;
					}

					if (start && comment.loc.start.line === endLine + 1) {
						endLine = comment.loc.end.line;
						continue;
					}

					if (start && !exempt) check(start, endLine);

					start = comment;
					endLine = comment.loc.end.line;
					// A run opening with the marker states why the code is shaped the way
					// it is, which is the one explanation that cannot be made shorter
					exempt = comment.range[0] < preambleEnd || MARKER.test(comment.value);
				}

				if (start && !exempt) check(start, endLine);
			},
		};
	},
	meta: {
		docs: {
			category: "Stylistic Issues",
			description: "Limit how many lines a plain comment spans",
			recommended: false,
		},
		messages: {
			tooLong:
				"This comment spans {{lines}} lines, over the limit of {{max}}. Split the thought, cut it, or move it into the JSDoc of what it describes.",
		},
		schema: [
			{
				type: "object",
				properties: { max: { type: "integer", minimum: 1 } },
				additionalProperties: false,
			},
		],
		type: "suggestion",
	},
};
