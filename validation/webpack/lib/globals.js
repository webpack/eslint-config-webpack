/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Alexander Akait @alexander-akait
*/

"use strict";

// `Cache` and `crypto` name TypeScript `lib` globals, which the parser puts in
// scope even though both are local here.
let crypto;

class Cache {
	/**
	 * Reads the hashing implementation, loading it on first use.
	 * @returns {typeof import("node:crypto")} the crypto module
	 */
	hash() {
		if (crypto === undefined) crypto = require("node:crypto");

		return crypto;
	}
}

module.exports = Cache;
