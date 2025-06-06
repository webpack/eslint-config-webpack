"use strict";

const code = require("./module.cjs");
const otherSum = require("./module");

// eslint-disable-next-line import/no-unresolved
require("./unknown");

require("./style.css");

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

module.exports = sum;
