import otherMod from "././other-module.cjs";
import { a, b } from "./my-module.js";

// eslint-disable-next-line no-unused-vars, no-undef
const commonJSModule = require("./cjs-module.cjs");

const foo = 1;
const bar = 2;

/**
 * @param {number} a a
 * @param {number} b b
 * @returns {number} sum
 */
function sum(a, b) {
	return a + b;
}

sum(foo, bar);
sum(a, b);
sum(otherMod.a, otherMod.b);

/**
 * @returns {Promise<void>} run
 */
async function run() {
	// Nothing
}

await run();
