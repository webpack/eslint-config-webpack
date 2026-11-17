/* eslint-disable no-console */

/**
 * Reports, for every rule of ESLint core and of every plugin used by our presets:
 * - whether any of our presets enables it, with which severity/options and in
 * which of our configs;
 * - whether the plugin's own presets (`recommended`, `strict`, ...) enable it,
 * with which severity/options, and how that compares to ours.
 *
 * Usage: `node scripts/find-not-enabled-rules.js [options]`
 *
 * - `--enabled` show only rules enabled by our presets
 * - `--not-enabled` show only rules not enabled by our presets
 * - `--plugin <name>` report only these plugins (`eslint` for core rules);
 * prefix a name with `!` to exclude it instead (e.g. `--plugin '!stylistic'`);
 * without any `--plugin` all plugins are reported; totals follow the selection
 * - `--rule <id>` show only these rules
 * - `--include-deprecated` also show deprecated rules
 * - `--all-upstream` also use upstream `all`/legacy/severity-variant presets
 * - `--json` print machine-readable output
 *
 * `--plugin` and `--rule` accept comma-separated values and can be repeated;
 * `--flag=value` works too. Plugin names may be given with or without a
 * leading `@` (`stylistic` matches `@stylistic`).
 */

import javascriptPlugin from "@eslint/js";
// eslint-disable-next-line import/no-unresolved
import { builtinRules } from "eslint/use-at-your-own-risk";
import configs from "../configs.js";

/** @typedef {import("eslint").Linter.Config} Config */
/** @typedef {import("eslint").Linter.RuleEntry} RuleEntry */
/** @typedef {import("eslint").Rule.RuleModule} RuleModule */
/** @typedef {{ configs?: Record<string, unknown>, rules?: Record<string, RuleModule> }} Plugin */

const CORE = "eslint";

const argv = process.argv.slice(2);

/**
 * @param {string} name flag name
 * @returns {string[]} values of a repeatable, comma-separated flag
 */
const getValues = (name) =>
	argv
		.flatMap((arg, i) => {
			if (arg === name) return argv[i + 1] ? [argv[i + 1]] : [];
			if (arg.startsWith(`${name}=`)) return [arg.slice(name.length + 1)];

			return [];
		})
		.flatMap((value) => value.split(","))
		.map((value) => value.trim())
		.filter(Boolean);

/**
 * @param {string} name plugin namespace
 * @returns {string} namespace without leading `@`
 */
const normalizePluginName = (name) => name.replace(/^@/, "");

const asJson = argv.includes("--json");
const onlyEnabled = argv.includes("--enabled");
const onlyNotEnabled = argv.includes("--not-enabled");
const includeDeprecated = argv.includes("--include-deprecated");
const allUpstream = argv.includes("--all-upstream");
const pluginArgs = getValues("--plugin");
const includedPlugins = new Set(
	pluginArgs
		.filter((name) => !name.startsWith("!"))
		.map((name) => normalizePluginName(name)),
);
const excludedPlugins = new Set(
	pluginArgs
		.filter((name) => name.startsWith("!"))
		.map((name) => normalizePluginName(name.slice(1))),
);

/**
 * @param {string} namespace plugin namespace
 * @returns {boolean} true when the plugin is selected by `--plugin`
 */
const isPluginSelected = (namespace) => {
	const name = normalizePluginName(namespace);

	if (excludedPlugins.has(name)) return false;

	return includedPlugins.size === 0 || includedPlugins.has(name);
};
const ruleFilter = new Set(getValues("--rule"));

/**
 * @param {unknown} value config or nested array of configs
 * @returns {Config[]} flat list of configs
 */
function flatten(value) {
	if (Array.isArray(value)) return value.flatMap(flatten);
	if (!value || typeof value !== "object") return [];

	const config = /** @type {Config & { extends?: unknown[] }} */ (value);

	return [...(config.extends ? flatten(config.extends) : []), config];
}

/**
 * @param {RuleEntry | undefined} entry rule entry
 * @returns {unknown[]} entry normalized to `[severity, ...options]` with string severity
 */
function normalize(entry) {
	const [severity, ...options] = Array.isArray(entry) ? entry : [entry];
	const names = /** @type {Record<string, string>} */ ({
		0: "off",
		1: "warn",
		2: "error",
	});

	return [names[String(severity)] || severity, ...options];
}

/**
 * @param {unknown[]} entry normalized entry
 * @returns {boolean} true when the rule is not disabled
 */
const isEnabled = (entry) => entry[0] !== "off" && entry[0] !== undefined;

/**
 * @param {unknown[]} entry normalized entry
 * @returns {string} printable entry
 */
const stringify = (entry) =>
	entry.length === 1 ? JSON.stringify(entry[0]) : JSON.stringify(entry);

/**
 * Upstream presets that only duplicate others (flat/legacy twins, `-error`
 * severity variants, deprecated aliases) or that enable everything (`all`).
 * @param {string} name upstream config name
 * @param {string[]} allNames all upstream config names of the plugin
 * @returns {boolean} true when the config should be skipped
 */
function isNoisyUpstream(name, allNames) {
	if (allUpstream) return false;
	if (/(?:^|\/)all(?:-|$)/.test(name)) return true;
	if (/-flat$|-legacy$|-error$|^disable-/.test(name)) return true;
	if (name.startsWith("flat/") && allNames.includes(name.slice(5))) {
		return true;
	}

	return false;
}

/**
 * Our `javascript/esXXXX` configs share most rules, so collapse them.
 * @param {string[]} names config names
 * @returns {string[]} names with `javascript/es*` collapsed into one entry
 */
function collapseEsVersions(names) {
	const es = names.filter((name) => /^javascript\/es\d+$/.test(name));

	if (es.length <= 2) return names;

	const versions = es
		.map((name) => name.slice("javascript/es".length))
		.toSorted((a, b) => Number(a) - Number(b));

	return [
		`javascript/es{${versions.join(",")}}`,
		...names.filter((name) => !es.includes(name)),
	];
}

/** @type {Map<string, Record<string, RuleModule>>} */
const availableRules = new Map([
	[
		CORE,
		Object.fromEntries(/** @type {Map<string, RuleModule>} */ (builtinRules)),
	],
]);
/** @type {Map<string, Plugin>} */
const plugins = new Map([
	[CORE, /** @type {Plugin} */ (/** @type {unknown} */ (javascriptPlugin))],
]);

/**
 * rule id -> serialized entry -> our config names using it
 * @type {Map<string, Map<string, { entry: unknown[], where: Set<string> }>>}
 */
const ours = new Map();
const seenConfigs = new Set();

for (const [presetName, preset] of Object.entries(configs)) {
	for (const config of flatten(preset)) {
		if (seenConfigs.has(config)) continue;
		seenConfigs.add(config);

		for (const [namespace, plugin] of Object.entries(config.plugins || {})) {
			if (!plugins.has(namespace)) {
				plugins.set(namespace, /** @type {Plugin} */ (plugin));
			}
			if (plugin && plugin.rules && !availableRules.has(namespace)) {
				availableRules.set(
					namespace,
					/** @type {Record<string, RuleModule>} */ (plugin.rules),
				);
			}
		}

		const where = config.name || presetName;

		for (const [ruleId, rawEntry] of Object.entries(config.rules || {})) {
			const entry = normalize(rawEntry);
			const key = stringify(entry);

			if (!ours.has(ruleId)) ours.set(ruleId, new Map());

			const variants =
				/** @type {Map<string, { entry: unknown[], where: Set<string> }>} */ (
					ours.get(ruleId)
				);

			if (!variants.has(key)) variants.set(key, { entry, where: new Set() });
			/** @type {{ where: Set<string> }} */ (variants.get(key)).where.add(
				where,
			);
		}
	}
}

/**
 * rule id -> upstream config label -> normalized entry (enabled entries only)
 * @type {Map<string, Map<string, unknown[]>>}
 */
const upstream = new Map();

for (const [namespace, plugin] of plugins) {
	const upstreamConfigs = plugin && plugin.configs;

	if (!upstreamConfigs || typeof upstreamConfigs !== "object") continue;

	const names = Object.keys(upstreamConfigs);

	for (const configName of names) {
		if (isNoisyUpstream(configName, names)) continue;

		const label = `${namespace}:${configName}`;

		for (const config of flatten(upstreamConfigs[configName])) {
			for (const [ruleId, rawEntry] of Object.entries(config.rules || {})) {
				const entry = normalize(rawEntry);

				if (!isEnabled(entry)) continue;
				if (!upstream.has(ruleId)) upstream.set(ruleId, new Map());
				/** @type {Map<string, unknown[]>} */ (upstream.get(ruleId)).set(
					label,
					entry,
				);
			}
		}
	}
}

/**
 * @typedef {object} RuleReport
 * @property {string} id rule id
 * @property {boolean} enabled enabled by at least one of our configs
 * @property {boolean} deprecated rule is deprecated
 * @property {{ value: unknown[], configs: string[] }[]} ours our settings
 * @property {{ preset: string, value: unknown[], comparison: string }[]} upstream upstream settings, `comparison` is `same`, `options differ`, `severity differs` or `not enabled by us`
 */

/** @type {Record<string, { total: number, enabled: number, rules: RuleReport[] }>} */
const report = {};
const knownRuleIds = new Set(
	[...availableRules].flatMap(([namespace, rules]) =>
		Object.keys(rules).map((name) =>
			namespace === CORE ? name : `${namespace}/${name}`,
		),
	),
);
const totals = { total: 0, enabled: 0 };

const namespaces = [...availableRules.keys()].toSorted((a, b) =>
	a === CORE ? -1 : b === CORE ? 1 : a.localeCompare(b),
);

const knownPluginNames = new Set(
	namespaces.map((namespace) => normalizePluginName(namespace)),
);

for (const name of [...includedPlugins, ...excludedPlugins]) {
	if (!knownPluginNames.has(name)) {
		console.error(
			`Unknown plugin "${name}", available: ${[...knownPluginNames].join(", ")}`,
		);
	}
}

for (const namespace of namespaces) {
	if (!isPluginSelected(namespace)) continue;

	const rules = /** @type {Record<string, RuleModule>} */ (
		availableRules.get(namespace)
	);
	const pluginReport = {
		total: 0,
		enabled: 0,
		rules: /** @type {RuleReport[]} */ ([]),
	};

	for (const name of Object.keys(rules).toSorted()) {
		const id = namespace === CORE ? name : `${namespace}/${name}`;
		const rule = rules[name];
		const deprecated = Boolean(rule && rule.meta && rule.meta.deprecated);
		const variants = [...(ours.get(id) || new Map()).values()];
		const enabled = variants.some(({ entry }) => isEnabled(entry));
		const enabledEntries = variants
			.map(({ entry }) => entry)
			.filter((entry) => isEnabled(entry));

		/**
		 * @param {unknown[]} value upstream entry
		 * @returns {string} how the upstream entry compares to ours
		 */
		const compare = (value) => {
			if (enabledEntries.length === 0) return "not enabled by us";
			if (
				enabledEntries.some((entry) => stringify(entry) === stringify(value))
			) {
				return "same";
			}
			if (enabledEntries.some((entry) => entry[0] === value[0])) {
				return "options differ";
			}

			return "severity differs";
		};

		if (!deprecated) {
			pluginReport.total++;
			if (enabled) pluginReport.enabled++;
		}

		if (deprecated && !includeDeprecated) continue;
		if (onlyEnabled && !enabled) continue;
		if (onlyNotEnabled && enabled) continue;
		if (ruleFilter.size > 0 && !ruleFilter.has(id)) continue;

		pluginReport.rules.push({
			id,
			enabled,
			deprecated,
			ours: variants.map(({ entry, where }) => ({
				value: entry,
				configs: collapseEsVersions([...where]),
			})),
			upstream: [...(upstream.get(id) || new Map())].map(([preset, value]) => ({
				preset,
				value,
				comparison: compare(value),
			})),
		});
	}

	totals.total += pluginReport.total;
	totals.enabled += pluginReport.enabled;

	if (ruleFilter.size > 0 && pluginReport.rules.length === 0) continue;

	report[namespace] = pluginReport;
}

// Rules configured in our presets that don't exist in any registered plugin
// (only meaningful when not limited to specific plugins)
const unknown = [...ours.keys()]
	.filter((ruleId) => includedPlugins.size === 0 && !knownRuleIds.has(ruleId))
	.toSorted();

if (asJson) {
	console.log(
		JSON.stringify(
			{ presets: Object.keys(configs), plugins: report, unknown },
			null,
			2,
		),
	);
} else {
	for (const [namespace, { total, enabled, rules }] of Object.entries(report)) {
		console.log(
			`\n## ${namespace} — enabled ${enabled}/${total} non-deprecated rules, ${
				total - enabled
			} not enabled`,
		);

		for (const rule of rules) {
			const flags = [
				rule.deprecated ? "deprecated" : "",
				rule.upstream.length > 0 ? "in upstream preset" : "",
			].filter(Boolean);

			console.log(
				`\n  ${rule.enabled ? "✔" : "✘"} ${rule.id}${
					flags.length > 0 ? ` [${flags.join(", ")}]` : ""
				}`,
			);

			for (const { value, configs: where } of rule.ours) {
				console.log(`      ours: ${stringify(value)}`);
				console.log(`        in: ${where.join("; ")}`);
			}

			for (const { preset, value, comparison } of rule.upstream) {
				console.log(
					`      upstream ${preset}: ${stringify(value)}${
						rule.enabled ? ` (${comparison})` : ""
					}`,
				);
			}
		}
	}

	if (unknown.length > 0) {
		console.log("\n## Configured rules not found in any registered plugin");
		for (const ruleId of unknown) console.log(`  - ${ruleId}`);
	}

	console.log(
		`\nPresets scanned: ${Object.keys(configs).length}, rules enabled: ${
			totals.enabled
		}, rules not enabled: ${totals.total - totals.enabled}`,
	);
}
