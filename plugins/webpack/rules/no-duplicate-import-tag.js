import { collectImportTags } from "../utils/import-tags.js";

/** @typedef {import("../utils/import-tags.js").ImportTag} ImportTag */

/**
 * Whether two tags could be written as one import statement. A namespace binding
 * cannot sit next to named bindings, and one statement carries at most one head.
 * @param {ImportTag} first the earlier tag
 * @param {ImportTag} second the later tag
 * @returns {boolean} true when they can be folded together
 */
const isMergeable = (first, second) => {
	const heads = /** @type {ImportTag[]} */ (
		[first, second].filter((tag) => tag.head !== undefined)
	);

	if (
		heads.length === 2 &&
		/** @type {NonNullable<ImportTag["head"]>} */ (heads[0].head).local !==
			/** @type {NonNullable<ImportTag["head"]>} */ (heads[1].head).local
	) {
		return false;
	}

	return (
		!heads.some((tag) => tag.namespace) ||
		first.named.length + second.named.length === 0
	);
};

/**
 * @type {import("eslint").Rule.RuleModule} rule rule
 */
export const rule = {
	create(context) {
		const { sourceCode } = context;

		return {
			"Program:exit"() {
				/** @type {Map<string, ImportTag>} */
				const seen = new Map();

				for (const tag of collectImportTags(sourceCode)) {
					const first = seen.get(tag.moduleRequest);

					if (first === undefined) {
						seen.set(tag.moduleRequest, tag);
						continue;
					}

					if (!isMergeable(first, tag)) {
						continue;
					}

					context.report({
						loc: {
							start: sourceCode.getLocFromIndex(tag.start),
							end: sourceCode.getLocFromIndex(tag.end),
						},
						messageId: "duplicateImportTag",
						data: {
							module: tag.moduleRequest,
							line: String(sourceCode.getLocFromIndex(first.start).line),
						},
					});
				}
			},
		};
	},
	meta: {
		docs: {
			category: "Stylistic Issues",
			description: "Require one `@import` per module in a file",
			recommended: true,
		},
		messages: {
			duplicateImportTag:
				'"{{module}}" is already imported on line {{line}}; fold this `@import` into that one.',
		},
		schema: [],
		type: "suggestion",
	},
};
