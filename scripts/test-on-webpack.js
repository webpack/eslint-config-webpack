/**
 * Lints the webpack repository with the local (unpublished) version of
 * `eslint-config-webpack`, to see how many problems a change of the config,
 * or a newly enabled rule, causes there, before releasing it.
 *
 * Steps:
 * 1. Clones webpack (shallow) into `.cache/webpack`, or updates an existing
 * clone, and installs its dependencies with yarn.
 * 2. Replaces `node_modules/eslint-config-webpack` in that clone with a symlink
 * to this repository (the published copy is kept next to it).
 * 3. Runs this repository's ESLint over webpack with webpack's own
 * `eslint.config.mjs` and prints the problems grouped by rule.
 *
 * Usage: `node scripts/test-on-webpack.js [options] [-- <extra eslint args>]`
 *
 * - `--rule <rule: value>` enable or change a rule for this run only, in
 * ESLint's `--rule` format, e.g. `--rule "unicorn/no-null: error"`; repeatable;
 * applies to the local config only, so with `--baseline` the difference shows
 * what the rule costs
 * - `--only-rules` report only rules given with `--rule`
 * - `--baseline` also lint with the published `eslint-config-webpack` webpack
 * depends on, and show how the number of problems per rule changes
 * - `--examples <n>` print up to `n` locations for each rule
 * - `--repo <url>` repository to clone (default: webpack/webpack on GitHub)
 * - `--ref <ref>` branch or tag to test (default: `main`)
 * - `--concurrency <n|auto|off>` ESLint `--concurrency` (default: `auto`)
 * - `--dir <path>` where to keep the clone (default: `.cache/webpack`)
 * - `--no-update` reuse the existing clone and dependencies as they are
 * - `--json` print the summary as JSON
 * - `--markdown` print the summary as Markdown (e.g. for a CI job summary)
 * - `--output <file>` also write ESLint's raw JSON results to a file
 *
 * Exits with code 1 when ESLint reports at least one error, 2 when the setup
 * (clone, install, ESLint crash) fails.
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** @typedef {import("eslint").ESLint.LintResult} LintResult */

/**
 * @typedef {object} RuleStats
 * @property {number} errors number of errors
 * @property {number} warnings number of warnings
 * @property {number} fixable number of auto-fixable problems
 * @property {Set<string>} files files with problems
 * @property {string[]} examples `file:line:column message` examples
 */

/**
 * @typedef {object} Summary
 * @property {number} files linted files
 * @property {number} filesWithProblems files with at least one problem
 * @property {number} errors total errors
 * @property {number} warnings total warnings
 * @property {number} fixable total auto-fixable problems
 * @property {Map<string, RuleStats>} rules stats per rule id
 */

const PACKAGE_NAME = "eslint-config-webpack";
const ORIGINAL_DIR = `.${PACKAGE_NAME}-original`;
const FATAL = "(parsing error)";
const NO_RULE = "(eslint-disable directives)";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Arguments after `--` go to ESLint as they are
const separator = process.argv.indexOf("--");
const argv =
	separator === -1 ? process.argv.slice(2) : process.argv.slice(2, separator);
const extraEslintArgs =
	separator === -1 ? [] : process.argv.slice(separator + 1);

/**
 * @param {string} name flag name
 * @returns {string[]} values of a repeatable flag (`--flag value` or `--flag=value`)
 */
const getValues = (name) =>
	argv.flatMap((arg, i) => {
		if (arg === name) return argv[i + 1] ? [argv[i + 1]] : [];
		if (arg.startsWith(`${name}=`)) return [arg.slice(name.length + 1)];

		return [];
	});

/**
 * @param {string} name flag name
 * @param {string} fallback default value
 * @returns {string} last value of the flag or the default
 */
const getValue = (name, fallback) => getValues(name).at(-1) ?? fallback;

const options = {
	repo: getValue("--repo", "https://github.com/webpack/webpack.git"),
	ref: getValue("--ref", "main"),
	dir: path.resolve(root, getValue("--dir", ".cache/webpack")),
	update: !argv.includes("--no-update"),
	baseline: argv.includes("--baseline"),
	rules: getValues("--rule"),
	onlyRules: argv.includes("--only-rules"),
	examples: Number(getValue("--examples", "0")),
	concurrency: getValue("--concurrency", "auto"),
	json: argv.includes("--json"),
	markdown: argv.includes("--markdown"),
	output: getValues("--output").at(-1),
};

if (!Number.isSafeInteger(options.examples) || options.examples < 0) {
	console.error("--examples expects a non-negative integer");
	process.exitCode = 2;
}

/**
 * Logs progress to stderr, so `--json` output on stdout stays parseable.
 * @param {string} message message
 */
const log = (message) => {
	console.error(`> ${message}`);
};

/**
 * @param {string} command command
 * @param {string[]} args arguments
 * @param {{ cwd?: string, quiet?: boolean }=} runOptions options
 * @returns {string} trimmed stdout
 */
function run(command, args, { cwd = root, quiet = false } = {}) {
	const result = spawnSync(command, args, {
		cwd,
		encoding: "utf8",
		stdio: ["ignore", "pipe", quiet ? "pipe" : "inherit"],
		maxBuffer: 1024 * 1024 * 1024,
	});

	if (result.error) throw result.error;
	if (result.status !== 0) {
		throw new Error(
			`\`${command} ${args.join(" ")}\` failed with exit code ${result.status}${
				quiet && result.stderr ? `:\n${result.stderr}` : ""
			}`,
		);
	}

	return result.stdout.trim();
}

/**
 * Clones the repository or brings an existing clone to the requested ref.
 */
function prepareClone() {
	if (!fs.existsSync(path.join(options.dir, ".git"))) {
		log(`Cloning ${options.repo} (${options.ref}) into ${options.dir}`);
		fs.mkdirSync(path.dirname(options.dir), { recursive: true });
		run("git", [
			"clone",
			"--depth",
			"1",
			"--branch",
			options.ref,
			options.repo,
			options.dir,
		]);

		return;
	}

	if (!options.update) return;

	log(`Updating ${options.dir} to ${options.ref}`);
	run("git", ["fetch", "--depth", "1", "origin", options.ref], {
		cwd: options.dir,
	});
	run("git", ["reset", "--hard", "FETCH_HEAD"], { cwd: options.dir });
}

/**
 * @returns {string} path of `node_modules/eslint-config-webpack` in the clone
 */
const getLinkPath = () => path.join(options.dir, "node_modules", PACKAGE_NAME);

/**
 * @returns {string} path where the published package from the clone is kept
 */
const getOriginalPath = () =>
	path.join(options.dir, "node_modules", ORIGINAL_DIR);

/**
 * Installs dependencies of the clone. A fresh install brings the published
 * `eslint-config-webpack` back, so it's moved aside again afterwards.
 */
function installDependencies() {
	const nodeModules = path.join(options.dir, "node_modules");

	if (!options.update && fs.existsSync(nodeModules)) return;

	// Let yarn see the published package where it installed it
	const link = getLinkPath();
	const original = getOriginalPath();

	if (fs.existsSync(original)) {
		fs.rmSync(link, { recursive: true, force: true });
		fs.renameSync(original, link);
	}

	log("Installing dependencies (yarn install --frozen-lockfile)");
	run(
		"yarn",
		[
			"install",
			"--frozen-lockfile",
			"--ignore-scripts",
			"--non-interactive",
			"--silent",
		],
		{ cwd: options.dir },
	);
}

/**
 * Points `node_modules/eslint-config-webpack` in the clone to `target`.
 * @param {string} target directory of the package to use
 */
function linkConfig(target) {
	const link = getLinkPath();
	const original = getOriginalPath();
	const stat = fs.lstatSync(link, { throwIfNoEntry: false });

	if (stat && !stat.isSymbolicLink()) {
		// Keep the published package for `--baseline`
		fs.rmSync(original, { recursive: true, force: true });
		fs.renameSync(link, original);
	} else if (stat) {
		fs.unlinkSync(link);
	}

	fs.symlinkSync(target, link, "dir");
}

/**
 * @param {string} cwd directory to resolve from
 * @param {string} name package name
 * @returns {string} package version
 */
const getVersion = (cwd, name) =>
	JSON.parse(
		fs.readFileSync(
			path.join(cwd, "node_modules", name, "package.json"),
			"utf8",
		),
	).version;

/**
 * @param {string} eslintDir directory whose `node_modules/eslint` to run
 * @param {string} label label for progress messages
 * @param {string[]} rules extra rules in ESLint `--rule` format
 * @returns {LintResult[]} ESLint results
 */
function lint(eslintDir, label, rules) {
	const eslintBin = path.join(
		eslintDir,
		"node_modules",
		"eslint",
		"bin",
		"eslint.js",
	);
	const outputFile = path.join(
		fs.mkdtempSync(path.join(os.tmpdir(), "eslint-on-webpack-")),
		"results.json",
	);
	const args = [
		eslintBin,
		"--format",
		"json",
		"--output-file",
		outputFile,
		"--no-error-on-unmatched-pattern",
		"--concurrency",
		options.concurrency,
		...rules.flatMap((rule) => ["--rule", rule]),
		...extraEslintArgs,
		".",
	];

	log(
		`Linting with ${label} (eslint ${getVersion(eslintDir, "eslint")}), this takes a while`,
	);

	const started = Date.now();
	const result = spawnSync(process.execPath, args, {
		cwd: options.dir,
		stdio: ["ignore", "inherit", "inherit"],
	});

	if (result.error) throw result.error;

	// 0 - no errors, 1 - lint errors, 2 - config or internal error
	if (result.status !== 0 && result.status !== 1) {
		throw new Error(`ESLint failed with exit code ${result.status}`);
	}

	log(`Done in ${Math.round((Date.now() - started) / 1000)}s`);

	const output = fs.readFileSync(outputFile, "utf8");

	fs.rmSync(path.dirname(outputFile), { recursive: true, force: true });

	return JSON.parse(output);
}

/**
 * @param {LintResult[]} results ESLint results
 * @returns {Summary} problems grouped by rule
 */
function summarize(results) {
	const onlyRuleIds = new Set(
		options.rules.map((rule) => rule.slice(0, rule.indexOf(":")).trim()),
	);
	/** @type {Summary} */
	const summary = {
		files: results.length,
		filesWithProblems: 0,
		errors: 0,
		warnings: 0,
		fixable: 0,
		rules: new Map(),
	};

	for (const result of results) {
		const file = path.relative(options.dir, result.filePath);
		let hasProblems = false;

		for (const message of result.messages) {
			const ruleId = message.ruleId || (message.fatal ? FATAL : NO_RULE);

			if (options.onlyRules && !onlyRuleIds.has(ruleId)) continue;

			hasProblems = true;

			/** @type {RuleStats} */
			const stats = summary.rules.get(ruleId) || {
				errors: 0,
				warnings: 0,
				fixable: 0,
				files: new Set(),
				examples: [],
			};

			summary.rules.set(ruleId, stats);
			stats.files.add(file);

			if (message.severity === 2) {
				stats.errors++;
				summary.errors++;
			} else {
				stats.warnings++;
				summary.warnings++;
			}

			if (message.fix) {
				stats.fixable++;
				summary.fixable++;
			}

			if (stats.examples.length < options.examples) {
				stats.examples.push(
					`${file}:${message.line}:${message.column} ${message.message.replaceAll(/\s+/g, " ")}`,
				);
			}
		}

		if (hasProblems) summary.filesWithProblems++;
	}

	return summary;
}

/**
 * @param {Summary} summary summary
 * @param {Summary=} baseline baseline summary
 * @returns {Record<string, unknown>} summary as plain JSON
 */
function toJson(summary, baseline) {
	const rules = Object.fromEntries(
		[...summary.rules].map(([ruleId, stats]) => [
			ruleId,
			{
				errors: stats.errors,
				warnings: stats.warnings,
				fixable: stats.fixable,
				files: stats.files.size,
				examples: stats.examples,
			},
		]),
	);

	return {
		files: summary.files,
		filesWithProblems: summary.filesWithProblems,
		errors: summary.errors,
		warnings: summary.warnings,
		fixable: summary.fixable,
		rules,
		...(baseline ? { baseline: toJson(baseline) } : {}),
	};
}

/**
 * @param {number} value number
 * @returns {string} number with sign, or empty for zero
 */
const signed = (value) =>
	value > 0 ? `+${value}` : value < 0 ? String(value) : "";

/**
 * @param {Summary} summary summary
 * @param {Summary=} baseline baseline summary
 * @returns {string[][]} header and rows, sorted by number of problems
 */
function getRows(summary, baseline) {
	const total = (/** @type {RuleStats | undefined} */ stats) =>
		stats ? stats.errors + stats.warnings : 0;
	const ruleIds = new Set([
		...summary.rules.keys(),
		...(baseline ? baseline.rules.keys() : []),
	]);
	const rows = [...ruleIds]
		.map((ruleId) => {
			const stats = summary.rules.get(ruleId);
			const before = baseline ? baseline.rules.get(ruleId) : undefined;

			return {
				ruleId,
				stats,
				delta: total(stats) - total(before),
			};
		})
		.toSorted(
			(a, b) =>
				total(b.stats) - total(a.stats) ||
				Math.abs(b.delta) - Math.abs(a.delta) ||
				a.ruleId.localeCompare(b.ruleId),
		);
	const header = ["Rule", "Errors", "Warnings", "Fixable", "Files"];

	if (baseline) header.push("Δ vs published");

	return [
		header,
		...rows.map(({ ruleId, stats, delta }) => {
			const row = [
				ruleId,
				String(stats ? stats.errors : 0),
				String(stats ? stats.warnings : 0),
				String(stats ? stats.fixable : 0),
				String(stats ? stats.files.size : 0),
			];

			if (baseline) row.push(signed(delta) || "0");

			return row;
		}),
	];
}

/**
 * @param {Summary} summary summary
 * @param {Summary=} baseline baseline summary
 */
function printTable(summary, baseline) {
	const table = getRows(summary, baseline);
	const [header] = table;
	const widths = header.map((_, column) =>
		Math.max(...table.map((row) => row[column].length)),
	);

	console.log("");

	for (const [index, row] of table.entries()) {
		console.log(
			row
				.map((cell, column) =>
					column === 0
						? cell.padEnd(widths[column])
						: cell.padStart(widths[column]),
				)
				.join("  "),
		);

		const stats = index > 0 ? summary.rules.get(row[0]) : undefined;

		if (stats) {
			for (const example of stats.examples) console.log(`    ${example}`);
		}
	}

	if (table.length === 1) console.log("No problems found");
}

/**
 * @param {Summary} summary summary
 * @param {Summary=} baseline baseline summary
 */
function printTotals(summary, baseline) {
	const line = (/** @type {Summary} */ value) =>
		`${value.errors} errors, ${value.warnings} warnings (${value.fixable} fixable) in ${value.filesWithProblems} of ${value.files} files`;

	console.log("");
	if (baseline) console.log(`Published config: ${line(baseline)}`);
	console.log(`Local config:     ${line(summary)}`);

	if (baseline) {
		console.log(
			`Difference:       ${signed(summary.errors - baseline.errors) || "0"} errors, ${
				signed(summary.warnings - baseline.warnings) || "0"
			} warnings`,
		);
	}
}

/**
 * @param {string} title title
 * @param {Summary} summary summary
 * @param {Summary=} baseline baseline summary
 */
function printMarkdown(title, summary, baseline) {
	const table = getRows(summary, baseline);
	const [header, ...rows] = table;
	const line = (/** @type {Summary} */ value) =>
		`**${value.errors}** errors, **${value.warnings}** warnings (${value.fixable} fixable) in ${value.filesWithProblems} of ${value.files} files`;
	const escape = (/** @type {string} */ text) =>
		text.replaceAll("|", String.raw`\|`).replaceAll("<", "&lt;");

	console.log(`## ${title}\n`);
	if (baseline) console.log(`- Published config: ${line(baseline)}`);
	console.log(`- Local config: ${line(summary)}`);
	if (baseline) {
		console.log(
			`- Difference: **${signed(summary.errors - baseline.errors) || "0"}** errors, **${
				signed(summary.warnings - baseline.warnings) || "0"
			}** warnings`,
		);
	}
	console.log("");

	if (rows.length === 0) {
		console.log("No problems found");

		return;
	}

	console.log(`| ${header.join(" | ")} |`);
	console.log(
		`| ${header.map((_, column) => (column === 0 ? "---" : "---:")).join(" | ")} |`,
	);
	for (const row of rows) {
		console.log(`| \`${row[0]}\` | ${row.slice(1).join(" | ")} |`);
	}

	const withExamples = rows.filter(
		([ruleId]) => (summary.rules.get(ruleId)?.examples.length ?? 0) > 0,
	);

	if (withExamples.length === 0) return;

	console.log("\n### Examples\n");
	for (const [ruleId] of withExamples) {
		const stats = /** @type {RuleStats} */ (summary.rules.get(ruleId));

		console.log(`<details><summary><code>${escape(ruleId)}</code></summary>\n`);
		for (const example of stats.examples) console.log(`- ${escape(example)}`);
		console.log("\n</details>");
	}
}

/**
 * @returns {number} exit code
 */
function main() {
	prepareClone();
	installDependencies();

	const commit = run("git", ["rev-parse", "--short", "HEAD"], {
		cwd: options.dir,
		quiet: true,
	});

	/** @type {Summary | undefined} */
	let baseline;

	if (options.baseline) {
		linkConfig(getOriginalPath());
		baseline = summarize(
			lint(
				options.dir,
				`published ${PACKAGE_NAME}@${getVersion(options.dir, ORIGINAL_DIR)}`,
				[],
			),
		);
	}

	linkConfig(root);

	const results = lint(root, `local ${PACKAGE_NAME} (${root})`, options.rules);
	const summary = summarize(results);

	if (options.output) {
		fs.writeFileSync(path.resolve(options.output), JSON.stringify(results));
		log(`ESLint results written to ${path.resolve(options.output)}`);
	}

	if (options.json) {
		console.log(
			JSON.stringify(
				{
					repo: options.repo,
					ref: options.ref,
					commit,
					...toJson(summary, baseline),
				},
				null,
				2,
			),
		);
	} else if (options.markdown) {
		printMarkdown(
			`ESLint on ${options.repo.replaceAll(/^https:\/\/github\.com\/|\.git$/g, "")} (${options.ref} @ ${commit})`,
			summary,
			baseline,
		);
	} else {
		console.log(`\n${options.repo} (${options.ref} @ ${commit})`);
		printTable(summary, baseline);
		printTotals(summary, baseline);
	}

	return summary.errors > 0 ? 1 : 0;
}

if (!process.exitCode) {
	try {
		process.exitCode = main();
	} catch (error) {
		console.error(error instanceof Error ? error.message : error);
		process.exitCode = 2;
	}
}
