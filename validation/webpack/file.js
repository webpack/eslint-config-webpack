/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Alexander Akait @alexander-akait
*/

"use strict";

/**
 * @param {number} a a
 * @param {number} b b
 * @returns {number} result
 */
function sum(a, b) {
	return a + b;
}

sum(1, 2);

/** @import { Buffer as NodeBuffer } from "node:buffer" */

/**
 * @param {NodeBuffer} buffer buffer
 * @returns {number} its length
 */
function size(buffer) {
	return buffer.length;
}

size(Buffer.from("webpack"));
