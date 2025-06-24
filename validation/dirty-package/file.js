import { a, b } from "./my-module.js";
import otherMod from "././other-module.cjs";

const commonJSModule = require("./module-js-common.js");

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
sum(commonJSModule.a, commonJSModule.b);
