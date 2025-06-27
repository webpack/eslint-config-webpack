/* eslint-disable id-length */

import a from "./a.js";
import b from "./b.js";
import c from "./c.js";
import e from "./e.js";
/* eslint-disable-next-line import/order */
import d from "./d.js";
import { a as a1, b as b1, c as c1 } from "./f.js";
/* eslint-disable-next-line import/order */
import { c as c2, a as a2, b as b2 } from "./g.js";
import z from "./h.js";
import { type A, type B, type C } from "./i.js";
import j from "./j.js";

const A: A = "A";
const B: B = "B";
const C: C = "C";

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
get(j);
get(A);
get(B);
get(C);

export const p = "p";
export const q = "q";
export const r = "r";

const s = "s";
const t = "t";
const u = "u";

// eslint-disable-next-line import/order
export { s, u, t };
