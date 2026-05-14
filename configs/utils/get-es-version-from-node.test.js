import assert from "node:assert/strict";
import { describe, it } from "node:test";

import getEsVersionFromNode from "./get-es-version-from-node.js";

describe("getEsVersionFromNode", () => {
	describe("major-version boundaries", () => {
		const cases = /** @type {const} */ ([
			[">=24.0.0", 2025],
			[">=22.0.0", 2025],
			[">=20.0.0", 2023],
			[">=16.11.0", 2022],
			[">=15.0.0", 2021],
			[">=14.0.0", 2020],
			[">=12.0.0", 2019],
			[">=10.0.0", 2018],
			[">=7.6.0", 2017],
			[">=7.0.0", 2016],
		]);

		for (const [range, expected] of cases) {
			it(`maps ${range} to ES${expected}`, () => {
				assert.equal(getEsVersionFromNode(range), expected);
			});
		}
	});

	describe("minor-version boundaries (the bug we fixed)", () => {
		it("treats Node 7.5 as ES2016 — async/await isn't available yet", () => {
			assert.equal(getEsVersionFromNode(">=7.5.0"), 2016);
		});

		it("treats Node 7.6 as ES2017 — async/await lands here", () => {
			assert.equal(getEsVersionFromNode(">=7.6.0"), 2017);
		});

		it("treats Node 16.10 as ES2021 — Object.hasOwn missing", () => {
			assert.equal(getEsVersionFromNode(">=16.10.0"), 2021);
		});

		it("treats Node 16.11 as ES2022 — Object.hasOwn finally lands", () => {
			assert.equal(getEsVersionFromNode(">=16.11.0"), 2022);
		});
	});

	describe("range expressions other than `>=`", () => {
		it("accepts a caret range (^20.9.0 → ES2023)", () => {
			assert.equal(getEsVersionFromNode("^20.9.0"), 2023);
		});

		it("accepts a tilde range (~22.5.0 → ES2025)", () => {
			assert.equal(getEsVersionFromNode("~22.5.0"), 2025);
		});

		it("accepts an exact version (20.0.0 → ES2023)", () => {
			assert.equal(getEsVersionFromNode("20.0.0"), 2023);
		});

		it("uses the lower bound of an OR range (12.0.0 || 14.0.0 → ES2019)", () => {
			assert.equal(getEsVersionFromNode("12.0.0 || 14.0.0"), 2019);
		});
	});

	describe("falls back to undefined", () => {
		it("returns undefined for Node 6 (caller maps to es2016 sans `**`)", () => {
			assert.equal(getEsVersionFromNode(">=6.5.0"), undefined);
		});

		it("returns undefined for Node 4 and older", () => {
			assert.equal(getEsVersionFromNode(">=4.0.0"), undefined);
		});

		it("returns undefined when given an unparseable range", () => {
			assert.equal(getEsVersionFromNode("not-a-range"), undefined);
		});
	});
});
