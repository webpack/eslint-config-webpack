"use strict";

function absolute(num: number) {
	return num < 0 ? -num : num;
}

module.exports = {
	pi: 3.14,
	squareTwo: 1.41,
	phi: 1.61,
	absolute,
};
