/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Alexander Akait @alexander-akait
*/

"use strict";

class Base {
	/* istanbul ignore next */
	/**
	 * Returns the unique identifier used to reference this module.
	 * @abstract
	 * @returns {string} a unique identifier of the module
	 */
	identifier() {
		throw new Error("Base.identifier is abstract");
	}

	/**
	 * Reads the size of the module.
	 * @param {string=} type the source type
	 * @returns {number} the size
	 */
	size(type) {
		return type ? 0 : 1;
	}
}

module.exports = Base;
