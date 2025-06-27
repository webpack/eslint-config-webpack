"use strict";

/* eslint-disable id-length */

const a = require("./a");
const b = require("./b");
const c = require("./c");
const e = require("./e");
/* eslint-disable-next-line import/order */
const d = require("./d");
const { a: a1, b: b1, c: c1 } = require("./f");
/* eslint-disable-next-line import/order */
const { c: c2, a: a2, b: b2 } = require("./g");
const z = require("./h");

/**
 * @template T
 * @param {T} val value
 * @returns {T} value
 */
function get(val) {
	return val;
}

get(a);
get(b);
get(c);
get(d);
get(e);
get(a1);
get(b1);
get(c1);
get(a2);
get(b2);
get(c2);
get(z);

module.exports.a = "a";
module.exports.c = "c";
// eslint-disable-next-line import/order
module.exports.b = "b";
