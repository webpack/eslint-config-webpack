"use strict";

const code = require("./module.cjs");
// eslint-disable-next-line no-unused-vars, import/extensions
const myOtherCode = require("./module.js");
const otherSum = require("./module");

// eslint-disable-next-line import/no-unresolved
require("./unknown");

require("./style.css");

const { aaa } = require("./module.cjs");

otherSum(aaa, 2);

const { bbb } = require("./module.cjs");

otherSum(bbb, 2);

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
