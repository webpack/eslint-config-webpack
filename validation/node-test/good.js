import assert from "node:assert/strict";
import { after, afterEach, before, beforeEach, describe, it } from "node:test";

/**
 * @param {number} a first number
 * @param {number} b second number
 * @returns {number} sum
 */
const sum = (a, b) => a + b;

/**
 * @returns {Promise<void>} always rejects
 */
async function fail() {
	throw new Error("Failed");
}

// An uppercase title is allowed for `describe`, e.g. to name a class
describe("Calculator", () => {
	let calls = 0;

	before(() => {
		calls = 0;
	});

	beforeEach(() => {
		calls++;
	});

	afterEach(() => {
		assert.ok(calls > 0);
	});

	after(() => {
		calls = 0;
	});

	it("adds numbers", () => {
		assert.strictEqual(sum(1, 2), 3);
	});

	it("compares structures deeply", () => {
		assert.deepStrictEqual(Object.keys({ a: 1 }), ["a"]);
	});

	it("rejects with an error", async () => {
		await assert.rejects(fail, /Failed/);
	});

	it("checks results conditionally", () => {
		const result = sum(2, 2);

		// Conditional assertions are allowed, as for Jest
		if (result > 0) {
			assert.strictEqual(result, 4);
		}
	});

	it("supports a done callback", (t, done) => {
		// The done callback is allowed, as for Jest
		setImmediate(() => {
			t.assert.strictEqual(sum(1, 1), 2);
			done();
		});
	});

	it("uses subtests", async (t) => {
		await t.test("first subtest", (t) => {
			t.assert.strictEqual(sum(1, 1), 2);
		});
	});

	it("mocks a function", (t) => {
		const fn = t.mock.fn(sum);

		fn(1, 2);

		t.assert.strictEqual(fn.mock.callCount(), 1);
	});
});

describe("top level describe", () => {
	it("top level test", () => {
		assert.strictEqual(sum(1, 1), 2);
	});
});
