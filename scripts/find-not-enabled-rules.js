/* eslint-disable no-console */

/**
 * Collects every rule enabled across all presets exported by this package
 * and reports which rules from the used plugins (and ESLint core) are never
 * enabled by any preset.
 *
 * Usage: `node scripts/find-not-enabled-rules.js [--json] [--include-deprecated] [--show-off]`
 *
 * - `--json` print machine-readable output
 * - `--include-deprecated` also report deprecated rules that are not enabled
 * - `--show-off` mark not-enabled rules that are explicitly set to "off"
 */

// eslint-disable-next-line import/no-unresolved
import { builtinRules } from "eslint/use-at-your-own-risk";
import configs from "../configs.js";

const args = new Set(process.argv.slice(2));
const asJson = args.has("--json");
const includeDeprecated = args.has("--include-deprecated");
const showOff = args.has("--show-off");

const CORE = "eslint";

/** @typedef {import("eslint").Linter.Config} Config */
/** @typedef {import("eslint").Linter.RuleEntry | undefined} RuleEntry */

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
 * @param {RuleEntry} entry rule entry
 * @returns {boolean} true when the rule is not disabled
 */
function isEnabled(entry) {
	const severity = Array.isArray(entry) ? entry[0] : entry;

	return severity !== "off" && severity !== 0 && severity !== undefined;
}

/** @type {Map<string, Set<string>>} rule id -> presets enabling it */
const enabled = new Map();
/** @type {Set<string>} rules explicitly set to off somewhere */
const turnedOff = new Set();
/** @type {Map<string, Record<string, import("eslint").Rule.RuleModule>>} */
const availableRules = new Map([
	[
		CORE,
		Object.fromEntries(
			/** @type {Map<string, import("eslint").Rule.RuleModule>} */ (
				builtinRules
			),
		),
	],
]);

for (const [presetName, preset] of Object.entries(configs)) {
	for (const config of flatten(preset)) {
		for (const [namespace, plugin] of Object.entries(config.plugins || {})) {
			if (plugin && plugin.rules && !availableRules.has(namespace)) {
				availableRules.set(
					namespace,
					/** @type {Record<string, import("eslint").Rule.RuleModule>} */ (
						plugin.rules
					),
				);
			}
		}

		for (const [ruleId, entry] of Object.entries(config.rules || {})) {
			if (isEnabled(entry)) {
				if (!enabled.has(ruleId)) enabled.set(ruleId, new Set());
				/** @type {Set<string>} */ (enabled.get(ruleId)).add(presetName);
			} else {
				turnedOff.add(ruleId);
			}
		}
	}
}

/**
 * @typedef {object} PluginReport
 * @property {number} total total rules in the plugin
 * @property {number} deprecated number of deprecated rules
 * @property {string[]} enabled enabled rule ids
 * @property {string[]} notEnabled rule ids never enabled
 * @property {string[]} explicitlyOff not-enabled rules explicitly set to "off"
 */

/** @type {Record<string, PluginReport>} */
const report = {};

for (const [namespace, rules] of [...availableRules].toSorted(([a], [b]) =>
	a === CORE ? -1 : b === CORE ? 1 : a.localeCompare(b),
)) {
	/** @type {PluginReport} */
	const pluginReport = {
		total: 0,
		deprecated: 0,
		enabled: [],
		notEnabled: [],
		explicitlyOff: [],
	};

	for (const [name, rule] of Object.entries(rules).toSorted(([a], [b]) =>
		a.localeCompare(b),
	)) {
		const ruleId = namespace === CORE ? name : `${namespace}/${name}`;
		const deprecated = Boolean(rule && rule.meta && rule.meta.deprecated);

		pluginReport.total++;
		if (deprecated) pluginReport.deprecated++;

		if (enabled.has(ruleId)) {
			pluginReport.enabled.push(ruleId);
		} else if (!deprecated || includeDeprecated) {
			pluginReport.notEnabled.push(
				deprecated ? `${ruleId} (deprecated)` : ruleId,
			);
			if (turnedOff.has(ruleId)) pluginReport.explicitlyOff.push(ruleId);
		}
	}

	report[namespace] = pluginReport;
}

// Rules configured in presets that don't exist in any registered plugin
const knownRuleIds = new Set(
	[...availableRules].flatMap(([namespace, rules]) =>
		Object.keys(rules).map((name) =>
			namespace === CORE ? name : `${namespace}/${name}`,
		),
	),
);
const unknown = [...enabled.keys()]
	.filter((ruleId) => !knownRuleIds.has(ruleId))
	.toSorted();

if (asJson) {
	console.log(
		JSON.stringify(
			{
				presets: Object.keys(configs),
				plugins: report,
				unknown,
			},
			null,
			2,
		),
	);
} else {
	let totalNotEnabled = 0;

	for (const [namespace, pluginReport] of Object.entries(report)) {
		totalNotEnabled += pluginReport.notEnabled.length;

		console.log(
			`\n## ${namespace} — enabled ${pluginReport.enabled.length}/${
				pluginReport.total - pluginReport.deprecated
			} non-deprecated rules, ${pluginReport.notEnabled.length} not enabled`,
		);

		for (const ruleId of pluginReport.notEnabled) {
			const off =
				showOff && pluginReport.explicitlyOff.includes(ruleId)
					? ' [explicitly "off"]'
					: "";
			console.log(`  - ${ruleId}${off}`);
		}
	}

	if (unknown.length > 0) {
		console.log("\n## Enabled rules not found in any registered plugin");
		for (const ruleId of unknown) console.log(`  - ${ruleId}`);
	}

	console.log(
		`\nPresets scanned: ${Object.keys(configs).length}, rules enabled: ${
			enabled.size
		}, rules not enabled: ${totalNotEnabled}`,
	);
}
