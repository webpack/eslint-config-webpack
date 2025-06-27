"use strict";

/**
 * @returns {void}
 */
function test() {
	// Nothing
}

/**
 * @returns {string} result
 */
module.exports = function test() {
	return "test";
};

/**
 * @returns {string} result
 */

module.exports.aaa = 1;

test();

module.exports.bbb = 1;
module.exports.other = function other() {
	return "test";
};
