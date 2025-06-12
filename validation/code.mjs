import code from "./module.cjs";
import myOtherCode from "./module.js";
// eslint-disable-next-line import/extensions
import otherSum from "./module";
// eslint-disable-next-line no-duplicate-imports
import { aaa, bbb } from "./module.cjs";

// eslint-disable-next-line import/no-unresolved
import("./unknown.ext");

import("./style.css");

otherSum(aaa, 2);

otherSum(bbb, 2);

myOtherCode(aaa, bbb);

code();
otherSum(1, 2);

/**
 * @param {number} a a
 * @param {number} b b
 * @returns {number} result
 */
function sum(a, b) {
	return a + b;
}

export default sum;
