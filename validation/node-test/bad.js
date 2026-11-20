// Each example breaks the rule named in the comment above it, so the lint
// fails if the rule stops reporting.
import assert from "node:assert/strict";
import { after, before, describe, it, test } from "node:test";

const sum = (a, b) => a + b;
/**
 * @returns {Promise<void>} always rejects
 */
async function fail() {
	throw new Error("Failed");
}

describe("bad examples", () => {
	before(() => {});

	after(() => {});

	// eslint-disable-next-line node-test/no-duplicate-hooks, node-test/hooks-order
	before(() => {});

	// eslint-disable-next-line node-test/no-only-test
	it.only("focused test", () => {
		assert.strictEqual(sum(1, 1), 2);
	});

	// eslint-disable-next-line node-test/no-skip-test
	it.skip("skipped test", () => {
		assert.strictEqual(sum(1, 1), 2);
	});

	it("same title", () => {
		assert.strictEqual(sum(1, 1), 2);
	});

	// eslint-disable-next-line node-test/no-identical-title
	it("same title", () => {
		assert.strictEqual(sum(2, 2), 4);
	});

	// eslint-disable-next-line node-test/prefer-lowercase-title
	it("Uppercase title", () => {
		assert.strictEqual(sum(1, 2), 3);
	});

	// eslint-disable-next-line node-test/require-assertion
	it("no assertion", () => {
		sum(1, 2);
	});

	it("deep equal with a primitive", () => {
		// eslint-disable-next-line node-test/no-incorrect-deep-equal
		assert.deepStrictEqual(sum(1, 1), 2);
	});

	it("strict equal with an array literal", () => {
		// eslint-disable-next-line node-test/no-incorrect-strict-equal
		assert.strictEqual(Object.keys({}), []);
	});

	it("constant assertion", () => {
		// eslint-disable-next-line node-test/no-constant-assertion
		assert.ok(true);
	});

	it("async function passed to assert.throws", () => {
		// eslint-disable-next-line node-test/no-assert-throws-async
		assert.throws(async () => {
			await fail();
		}, Error);
	});

	it("string as the assert.match regexp", () => {
		// eslint-disable-next-line node-test/no-assert-match-string
		assert.match("abc", "b");
	});

	it("assert.rejects without an error matcher", async () => {
		// eslint-disable-next-line node-test/require-throws-expectation
		await assert.rejects(fail);
	});

	it("unneeded async assert.rejects callback", async () => {
		// eslint-disable-next-line node-test/no-unneeded-async-rejects-callback
		await assert.rejects(async () => {
			await fail();
		}, Error);
	});

	it("nested test", () => {
		// eslint-disable-next-line node-test/no-nested-tests
		it("inner", () => {
			assert.strictEqual(sum(1, 1), 2);
		});

		assert.strictEqual(sum(1, 1), 2);
	});

	it("mutates process.env", () => {
		// eslint-disable-next-line node-test/no-process-env-mutation
		process.env.FOO = "bar";
		assert.strictEqual(process.env.FOO, "bar");
	});

	// eslint-disable-next-line node-test/no-commented-tests
	// it("commented out test", () => {});

	// eslint-disable-next-line node-test/consistent-test-it
	test("test inside describe", () => {
		assert.strictEqual(sum(1, 1), 2);
	});
});

// eslint-disable-next-line node-test/no-async-describe
describe("async describe", async () => {
	it("inside an async describe", () => {
		assert.strictEqual(sum(1, 1), 2);
	});
});

// eslint-disable-next-line node-test/consistent-test-it
it("top level it", () => {
	assert.strictEqual(sum(1, 1), 2);
});
