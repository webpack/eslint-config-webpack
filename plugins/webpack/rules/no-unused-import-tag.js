import { collectImportTags } from "../utils/import-tags.js";

/** @typedef {import("eslint").Rule.ReportFixer} ReportFixer */
/** @typedef {import("eslint").SourceCode} SourceCode */
/** @typedef {import("../utils/import-tags.js").ImportBinding} ImportBinding */
/** @typedef {import("../utils/import-tags.js").ImportTag} ImportTag */

/**
 * The source with every `@import` tag blanked out, so one import can never keep
 * another alive. Blanks keep the length, so offsets still address the original.
 * @param {string} text the whole source
 * @param {ImportTag[]} tags every `@import` tag in it
 * @returns {string} the haystack a binding's uses are looked for in
 */
const buildHaystack = (text, tags) => {
	let haystack = text;

	for (const tag of tags) {
		haystack =
			haystack.slice(0, tag.start) +
			" ".repeat(tag.end - tag.start) +
			haystack.slice(tag.end);
	}

	return haystack;
};

/**
 * @param {string} text the whole source
 * @param {number} index an offset inside the line
 * @returns {[number, number]} the line's range, the line break included
 */
const lineRangeAt = (text, index) => {
	const start = text.lastIndexOf("\n", index - 1) + 1;
	const lineBreak = text.indexOf("\n", index);

	return [start, lineBreak === -1 ? text.length : lineBreak + 1];
};

/**
 * Whether the tag is the only tag of a comment that owns its line — the one shape
 * that can be removed outright.
 * @param {string} text the whole source
 * @param {ImportTag} tag the tag to test
 * @returns {[number, number] | null} the range to remove, or null when unsure
 */
const removableCommentRange = (text, tag) => {
	const range = /** @type {[number, number]} */ (tag.comment.range);

	if (text.slice(range[0], tag.start).replace(/[/*\s]/g, "") !== "") {
		return null;
	}

	if (/@\w/.test(text.slice(tag.end, range[1]))) {
		return null;
	}

	const [start, end] = lineRangeAt(text, range[0]);
	const outside =
		text.slice(start, range[0]) +
		text.slice(range[1], end).replace(/\r?\n$/, "");

	return outside.trim() === "" ? [start, end] : null;
};

/**
 * @param {SourceCode} sourceCode source being linted
 * @param {ImportTag} tag the tag the binding belongs to
 * @param {ImportBinding} binding the unused binding
 * @param {number} bindingCount how many bindings the tag declares
 * @returns {ReportFixer | null} a fixer, or null when the edit is not obvious
 */
const buildFixer = (sourceCode, tag, binding, bindingCount) => {
	const text = sourceCode.getText();

	if (bindingCount === 1) {
		const range = removableCommentRange(text, tag);

		return range === null ? null : (fixer) => fixer.removeRange(range);
	}

	// Only a named binding can be taken out on its own; dropping the head would
	// leave a dangling comma the shapes below do not cover
	if (binding === tag.head) {
		return null;
	}

	if (text.slice(tag.start, tag.end).includes("\n")) {
		// The wrapped form puts one binding per line, so the line goes with it
		const range = lineRangeAt(text, binding.start);
		const rest =
			text.slice(range[0], binding.start) + text.slice(binding.end, range[1]);

		if (!/^[\s*,]*$/.test(rest)) {
			return null;
		}

		// Taking the last binding away would strand the comma the one before it ends
		// with, which `trailingComma: "none"` does not allow
		const previous = tag.named
			.filter((other) => other.end <= binding.start)
			.sort((one, another) => another.end - one.end)[0];
		const strandedComma =
			previous !== undefined &&
			!tag.named.some((other) => other.start >= binding.end)
				? text.indexOf(",", previous.end)
				: -1;

		return strandedComma === -1 || strandedComma >= binding.start
			? (fixer) => fixer.removeRange(range)
			: (fixer) => [
					fixer.removeRange([strandedComma, strandedComma + 1]),
					fixer.removeRange(range),
			  ];
	}

	// `{ A, B }` on one line: the binding leaves with the comma that separates it
	const after = /^[ \t]*,[ \t]*/.exec(text.slice(binding.end));

	if (after !== null) {
		return (fixer) =>
			fixer.removeRange([binding.start, binding.end + after[0].length]);
	}

	const before = /[ \t]*,[ \t]*$/.exec(text.slice(tag.start, binding.start));

	return before === null
		? null
		: (fixer) =>
				fixer.removeRange([binding.start - before[0].length, binding.end]);
};

/**
 * @type {import("eslint").Rule.RuleModule} rule rule
 */
export const rule = {
	create(context) {
		const { sourceCode } = context;

		return {
			"Program:exit"() {
				const tags = collectImportTags(sourceCode);

				if (tags.length === 0) {
					return;
				}

				const haystack = buildHaystack(sourceCode.getText(), tags);

				for (const tag of tags) {
					const bindings = [
						...(tag.head === undefined ? [] : [tag.head]),
						...tag.named,
					];

					for (const binding of bindings) {
						const used = new RegExp(
							`(?<![\\w$])${binding.local.replace(/\$/g, "\\$")}(?![\\w$])`,
						).test(haystack);

						if (used) {
							continue;
						}

						context.report({
							loc: {
								start: sourceCode.getLocFromIndex(binding.start),
								end: sourceCode.getLocFromIndex(binding.end),
							},
							messageId: "unusedImportTag",
							data: { name: binding.local },
							fix: buildFixer(sourceCode, tag, binding, bindings.length),
						});
					}
				}
			},
		};
	},
	meta: {
		docs: {
			category: "Stylistic Issues",
			description: "Require every `@import` binding to be referenced",
			recommended: true,
		},
		fixable: "code",
		messages: {
			unusedImportTag: "`{{name}}` is imported but never referenced.",
		},
		schema: [],
		type: "suggestion",
	},
};
