import path from "node:path";
import unicornPlugin from "eslint-plugin-unicorn";
import { codeExtensions } from "./utils/code-files.js";
import isTypescriptInstalled from "./utils/is-typescript-installed.js";

/** @typedef {import("eslint").Linter.Processor} Processor */
/** @typedef {import("eslint").Linter.LintMessage & { probe?: { block: number, line: number } }} Message */

const UNUSED_DIRECTIVE = /^Unused eslint-(?:disable|enable) directive/u;
const PROBE_MESSAGE = "Unused eslint-disable directive (location probe)";

// Code block extensions other configs lint, so their content isn't the
// document's to check
const lintedCodeBlockExtensions = new Set([...codeExtensions, ".md"]);

/**
 * @param {Message} message message
 * @returns {boolean} true for an unused-directive report
 */
const isUnusedDirective = (message) =>
	message.ruleId === null && UNUSED_DIRECTIVE.test(message.message);

/**
 * @param {Message} message message
 * @returns {string} key of the message's start position
 */
const positionOf = (message) => `${message.line}:${message.column}`;

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
 *
 * Both passes see what the other one lints, which `postprocess` reconciles:
 * - `@eslint/markdown` copies `<!-- eslint-disable ... -->` comments that come
 * right before a code block into it, so both passes read them. Each pass
 * reports them as unused when they disable nothing there, and `--fix` would
 * delete a directive the other pass needs. Such a directive is reported only
 * when both passes report it in the same way.
 * - Some rules scan the whole document text, code blocks included, so the
 * document pass would report code that the code block pass already lints with
 * its own config and directives. Document reports inside such code blocks are
 * dropped.
 *
 * Positions come from `@eslint/markdown` itself: `postprocess` maps a probe
 * message on every line of every code block through it. A copied comment line
 * maps to the start of its HTML comment (with an end position), a code line to
 * its line in the file.
 * @param {Processor} markdownProcessor processor of `@eslint/markdown`
 * @returns {Processor} processor for code blocks and Markdown content
 */
function createMarkdownProcessor(markdownProcessor) {
	/** @type {Map<string, { filename: string, lines: number }[]>} */
	const cache = new Map();

	return {
		meta: { name: "eslint-config-webpack/markdown" },
		supportsAutofix: true,
		preprocess(text, filename) {
			const codeBlocks = /** @type {NonNullable<Processor["preprocess"]>} */ (
				markdownProcessor.preprocess
			)(text, filename).map((block) =>
				typeof block === "string" ? { text: block, filename: "0.js" } : block,
			);

			cache.set(
				filename,
				codeBlocks.map((block) => ({
					filename: block.filename,
					lines: block.text.split("\n").length,
				})),
			);

			return [...codeBlocks, { text, filename: path.basename(filename) }];
		},
		postprocess(messages, filename) {
			const blocks = cache.get(filename) || [];

			cache.delete(filename);

			/** @type {Message[][]} */
			const probedGroups = messages.slice(0, -1).map((group, index) => [
				...group,
				...Array.from(
					{ length: blocks[index] ? blocks[index].lines : 0 },
					(_, line) => ({
						ruleId: null,
						message: PROBE_MESSAGE,
						severity: /** @type {1} */ (1),
						line: line + 1,
						column: 1,
						probe: { block: index, line: line + 1 },
					}),
				),
			]);
			const mapped = /** @type {Message[]} */ (
				/** @type {NonNullable<Processor["postprocess"]>} */ (
					markdownProcessor.postprocess
				)(probedGroups, filename)
			);

			/** @type {Set<string>} */
			const copiedDirectives = new Set();
			/** @type {Set<number>} */
			const lintedCodeLines = new Set();
			/** @type {Message[]} */
			const codeBlockMessages = [];

			for (const message of mapped) {
				if (message.probe === undefined) {
					codeBlockMessages.push(message);
				} else if (message.endLine !== undefined) {
					// A copied comment line: mapped to the start of its HTML comment
					copiedDirectives.add(positionOf(message));
				} else if (
					// A code line: mapped to its line in the file (probes past the
					// code come back unchanged)
					message.line !== message.probe.line &&
					lintedCodeBlockExtensions.has(
						path.extname(blocks[message.probe.block].filename),
					)
				) {
					lintedCodeLines.add(message.line);
				}
			}

			/** @type {Map<string, Message[]>} */
			const codeBlockUnused = new Map();

			for (const message of codeBlockMessages) {
				if (!(
					isUnusedDirective(message) &&
					copiedDirectives.has(positionOf(message))
				)) {
					continue;
				}

				const key = positionOf(message);

				codeBlockUnused.set(key, [
					...(codeBlockUnused.get(key) || []),
					message,
				]);
			}

			/** @type {Map<string, Message[]>} */
			const documentUnused = new Map();
			/** @type {Message[]} */
			const documentMessages = [];

			for (const message of messages.at(-1) || []) {
				if (
					isUnusedDirective(message) &&
					copiedDirectives.has(positionOf(message))
				) {
					const key = positionOf(message);

					documentUnused.set(key, [
						...(documentUnused.get(key) || []),
						message,
					]);
				} else if (
					message.ruleId === null ||
					!lintedCodeLines.has(message.line)
				) {
					documentMessages.push(message);
				}
			}

			// A copied directive is unused only when both passes say so in the
			// same way; then the code block report (with its fix) is kept
			/** @type {Set<Message>} */
			const droppedCodeBlockMessages = new Set();

			for (const [key, reports] of codeBlockUnused) {
				const documentReports = documentUnused.get(key) || [];
				const same =
					documentReports.length === reports.length &&
					reports.every(
						(report, index) =>
							report.message === documentReports[index].message,
					);

				if (!same) {
					for (const report of reports) droppedCodeBlockMessages.add(report);
				}
			}

			return [
				...codeBlockMessages.filter(
					(message) => !droppedCodeBlockMessages.has(message),
				),
				...documentMessages,
			]
				.map(({ probe, ...message }) => message)
				.toSorted((a, b) => a.line - b.line || a.column - b.column);
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
