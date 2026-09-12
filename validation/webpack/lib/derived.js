/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Alexander Akait @alexander-akait
*/

"use strict";

const Base = require("./base");

class Derived extends Base {
	/**
	 * Returns the unique identifier used to reference this module.
	 * @returns {string} a unique identifier of the module
	 */
	identifier() {
		return "derived";
	}

	/**
	 * Reads the size of the module.
	 * @param {string=} type the source type
	 * @returns {number} the size
	 */
	size(type) {
		return type ? 2 : 3;
	}

	/**
	 * A method the base class does not declare, so nothing is inherited.
	 * @returns {string} the name
	 */
	ownMethod() {
		return "own";
	}
}

module.exports = Derived;
