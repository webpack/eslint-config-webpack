"use strict";

const mod = require("./my-module");
// eslint-disable-next-line import/extensions
const modAgain = require("./my-module.js");
const otherMod = require("./other-module.cjs");

require("../typescript-node-support/my-other-code.ts");
require("../typescript-node-support/my-other-code");
// eslint-disable-next-line import/extensions
require("./my-module-1.js");

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
sum(mod.a, mod.b);
sum(otherMod.a, otherMod.b);
sum(modAgain.a, modAgain.b);
