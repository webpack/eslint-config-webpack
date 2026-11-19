import path from "node:path";
import unicornPlugin from "eslint-plugin-unicorn";
import isTypescriptInstalled from "./utils/is-typescript-installed.js";

/** @typedef {import("eslint").Linter.Processor} Processor */

/**
 * The `markdown` processor of `@eslint/markdown` returns only the fenced code
 * blocks, so ESLint lints them but never the Markdown itself, and upstream
 * suggests a second ESLint run for the Markdown content.
 *
 * This processor also returns the whole document as one more block, with the
 * original text and a `.md` name. ESLint lints a block with the same text and
 * extension as the file with the file's own config, so the document is parsed
 * with the Markdown language and checked with the Markdown rules of the
 * `**\/*.md` config, in the same run as the code blocks.
 * @param {Processor} markdownProcessor processor of `@eslint/markdown`
 * @returns {Processor} processor for code blocks and Markdown content
 */
function createMarkdownProcessor(markdownProcessor) {
	/**
	 * Per file: its text and the `/* ... *\/` comments `@eslint/markdown`
	 * copied from HTML comments into the code blocks right after them.
	 * @type {Map<string, { text: string, codeBlockComments: Set<string> }>}
	 */
	const cache = new Map();

	/**
	 * The document pass also sees `<!-- eslint-disable ... -->` comments meant
	 * for the next code block, where they usually disable nothing, so it would
	 * report them as unused and `--fix` would delete them. Such a report belongs
	 * to the code block, whose own pass already reports the directive when it
	 * is unused there.
	 * @param {import("eslint").Linter.LintMessage} message document message
	 * @param {{ text: string, codeBlockComments: Set<string> }} file cached file
	 * @returns {boolean} true when the message is about a code block directive
	 */
	const isCodeBlockDirectiveReport = (message, file) => {
		if (
			message.ruleId !== null ||
			!/^Unused eslint-(?:disable|enable) directive/u.test(message.message)
		) {
			return false;
		}

		const lines = file.text.split("\n");
		const offset =
			lines
				.slice(0, message.line - 1)
				.reduce((total, line) => total + line.length + 1, 0) +
			message.column -
			1;
		const rest = file.text.slice(offset);

		if (!rest.startsWith("<!--")) return false;

		const end = rest.indexOf("-->");

		return (
			end !== -1 && file.codeBlockComments.has(`/*${rest.slice(4, end)}*/`)
		);
	};

	return {
		meta: { name: "eslint-config-webpack/markdown" },
		supportsAutofix: true,
		preprocess(text, filename) {
			const codeBlocks = /** @type {NonNullable<Processor["preprocess"]>} */ (
				markdownProcessor.preprocess
			)(text, filename);
			const codeBlockComments = new Set();

			for (const block of codeBlocks) {
				const blockText = typeof block === "string" ? block : block.text;

				// Copied comments come first, one per line
				for (const line of blockText.split("\n")) {
					if (!/^\/\*.*\*\/$/u.test(line)) break;
					codeBlockComments.add(line);
				}
			}

			cache.set(filename, { text, codeBlockComments });

			return [...codeBlocks, { text, filename: path.basename(filename) }];
		},
		postprocess(messages, filename) {
			const file = cache.get(filename) || {
				text: "",
				codeBlockComments: new Set(),
			};

			cache.delete(filename);

			const documentMessages = (messages.at(-1) || []).filter(
				(message) => !isCodeBlockDirectiveReport(message, file),
			);
			const codeBlockMessages =
				/** @type {NonNullable<Processor["postprocess"]>} */ (
					markdownProcessor.postprocess
				)(messages.slice(0, -1), filename);

			// Document messages already point at the right place in the file
			return [...codeBlockMessages, ...documentMessages].toSorted(
				(a, b) => a.line - b.line || a.column - b.column,
			);
		},
	};
}

/**
 * @returns {Promise<import("eslint").Linter.Config[]>} config
 */
async function getMarkdownRecommendedConfig() {
	const markdownPlugin = (await import("@eslint/markdown")).default;
	const {
		configs: { recommended },
	} =
		/** @type {{ configs: { recommended: import("eslint").Linter.Config[] } }} */ (
			/** @type {unknown} */ (markdownPlugin)
		);

	return [
		{
			name: "markdown/recommended",
			files: ["**/*.md"],
			// GitHub renders our Markdown, so tables, task lists and the like are valid
			language: "markdown/gfm",
			processor: createMarkdownProcessor(markdownPlugin.processors.markdown),
			plugins: {
				markdown: markdownPlugin,
				unicorn: unicornPlugin,
			},
			// Same as for JavaScript, so a `<!-- eslint-disable -->` comment that
			// disables nothing fails the lint
			linterOptions: {
				reportUnusedDisableDirectives: "error",
				reportUnusedInlineConfigs: "error",
			},
			rules: {
				...recommended.find((config) => config.name === "markdown/recommended")
					?.rules,

				// `unicorn` rules that support Markdown and that we use for
				// JavaScript too, with the same options
				"unicorn/no-abusive-eslint-disable": "error",

				// `unicorn/no-missing-local-resource` would fit too, but it skips
				// virtual files and the document is linted as one (see the processor)

				"unicorn/prefer-https": "error",

				"unicorn/relative-url-style": ["error", "always"],

				// Markdown-only `unicorn` rules
				"unicorn/no-empty-link-text": "error",

				"unicorn/no-javascript-url": "error",
			},
		},
		{
			name: "markdown/code-blocks/js",
			files: isTypescriptInstalled()
				? ["**/*.md/*.js", "**/*.md/*.ts"]
				: ["**/*.md/*.js"],
			languageOptions: {
				sourceType: "module",
				ecmaVersion: "latest",
				parserOptions: {
					ecmaFeatures: {
						globalReturn: true,
						impliedStrict: true,
					},
				},
			},
			rules: {
				"id-length": "off",

				strict: "off",

				// For different examples
				camelcase: "off",

				"unicode-bom": "off",

				"eol-last": "off",

				"no-undef": "off",

				"no-unused-private-class-members": "off",

				"no-unused-vars": "off",

				"no-unused-expressions": "off",

				"no-unused-labels": "off",

				"no-console": "off",

				"no-new": "off",

				"unicorn/no-unused-properties": "off",

				// Allow to use any packages in documentation
				"n/no-unpublished-require": "off",

				// Allow to use any packages in documentation
				"n/no-unpublished-import": "off",

				// Allow to use any ES builtins in documentation
				"n/no-unsupported-features/es-builtins": "off",

				// Allow to use any ES syntax in documentation
				"n/no-unsupported-features/es-syntax": "off",

				// Allow to use any Node.js API in documentation
				"n/no-unsupported-features/node-builtins": "off",

				// Allow to use any packages in documentation
				"n/no-missing-import": "off",

				// Allow to use any packages in documentation
				"n/no-missing-require": "off",

				// Useful for documentation
				"n/no-process-exit": "off",

				"import-x/no-unresolved": "off",

				"import-x/no-extraneous-dependencies": "off",

				"jsdoc/require-jsdoc": "off",

				"@typescript-eslint/no-unused-vars": "off",

				"@typescript-eslint/no-explicit-any": "off",

				"@typescript-eslint/triple-slash-reference": "off",
			},
		},
	];
}

export default {
	"markdown/recommended": await getMarkdownRecommendedConfig(),
};
