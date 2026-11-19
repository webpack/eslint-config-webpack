import { allExtensions, javascriptExtensions } from "./extensions.js";
import isTypescriptInstalled from "./is-typescript-installed.js";

const extensions = isTypescriptInstalled()
	? allExtensions
	: javascriptExtensions;

/**
 * The files the JavaScript config lints. Configs with JavaScript rules or
 * language options use it as `files` (with `codeIgnores`), so they apply to
 * the same files and not to other languages linted in the same run, such as
 * Markdown.
 */
const codeFiles = [
	`**/*.{${extensions.map((extension) => extension.slice(1)).join(",")}}`,
];

const codeIgnores = ["**/*.d.ts"];

export { codeFiles, codeIgnores };
