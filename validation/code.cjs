"use strict";

const otherSum = require("./module");
const code = require("./module.cjs");

const { aaa } = require("./module.cjs");

otherSum(aaa, 2);

const { bbb } = require("./module.cjs");

otherSum(bbb, 2);

// eslint-disable-next-line no-unused-vars, import-x/extensions
const myOtherCode = require("./module.js");

// eslint-disable-next-line import-x/no-unresolved
require("./unknown.unknown");

require("./style.css");

// eslint-disable-next-line no-unused-vars, import-x/order, import-x/no-extraneous-dependencies
const scope = require("eslint-scope");

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
