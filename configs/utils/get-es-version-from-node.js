import semver from "semver";

/**
 * @typedef {2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025} EsVersion
 */

/**
 * Ordered table from Node version ranges to the highest ES version every
 * release in the range fully supports.
 *
 * The table respects minor versions where they shift the supported feature
 * set, e.g. async/await landed in Node 7.6 (ES2017), and `Object.hasOwn`
 * landed in Node 16.11 (ES2022) — the last ES2022 feature to ship on the
 * Node 16 line.
 *
 * Sources: https://node.green/ and the Node.js/V8 release notes. Entries
 * are sorted newest-to-oldest; the first matching entry wins.
 * @type {ReadonlyArray<{ range: string, esVersion: EsVersion }>}
 */
const ranges = [
	// ES2025: Iterator helpers, Promise.try, Set composition (union, intersection, …).
	{ range: ">=24.0.0", esVersion: 2025 },
	// ES2024: Object.groupBy/Map.groupBy, Promise.withResolvers, Atomics.waitAsync.
	{ range: ">=22.0.0", esVersion: 2024 },
	// ES2023: Array-by-copy (toSorted/toReversed/toSpliced/with), findLast/findLastIndex.
	{ range: ">=20.0.0", esVersion: 2023 },
	// ES2022: Object.hasOwn is the last ES2022 feature to land on the Node 16 line.
	// Earlier 16.x has top-level await (>=14.8), `.at()` (>=16.6) and Error cause (>=16.9)
	// but not Object.hasOwn, so it can't safely claim full ES2022.
	{ range: ">=16.11.0", esVersion: 2022 },
	// ES2021: logical assignment operators, String#replaceAll, Promise.any, WeakRef.
	{ range: ">=15.0.0", esVersion: 2021 },
	// ES2020: optional chaining, nullish coalescing, BigInt, Promise.allSettled, globalThis.
	{ range: ">=14.0.0", esVersion: 2020 },
	// ES2019: Object.fromEntries, Array#flat/flatMap, String#trimStart/trimEnd.
	{ range: ">=12.0.0", esVersion: 2019 },
	// ES2018: object rest/spread, async iteration, RegExp lookbehind, Promise#finally.
	{ range: ">=10.0.0", esVersion: 2018 },
	// ES2017: async/await is the gating feature — landed in 7.6, not 7.0.
	{ range: ">=7.6.0", esVersion: 2017 },
	// ES2016: ** exponentiation operator and Array#includes (both require >=7.0).
	{ range: ">=7.0.0", esVersion: 2016 },
];

/**
 * Resolves the highest ES version every Node release matched by
 * `nodeRange` fully supports.
 *
 * Returns `undefined` when the lower bound is older than our oldest entry
 * (Node 7.0), so callers can apply project-specific fallbacks — for example
 * Node 6, which has `Array#includes` (from 6.5) but never gained the `**`
 * operator and so doesn't map cleanly to a single ES year.
 * @param {string} nodeRange a semver range, typically `package.json#engines.node`
 * @returns {EsVersion | undefined} matching ES version, or `undefined`
 */
function getEsVersionFromNode(nodeRange) {
	const minVersion = semver.minVersion(nodeRange);

	if (!minVersion) {
		return undefined;
	}

	for (const { range, esVersion } of ranges) {
		if (semver.satisfies(minVersion, range)) {
			return esVersion;
		}
	}

	return undefined;
}

export default getEsVersionFromNode;
