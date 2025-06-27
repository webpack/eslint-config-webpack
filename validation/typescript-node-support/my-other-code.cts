"use strict";

const maths = require("./maths.cts");
const mathsOther = require("./other-maths");
const a = require("./other-module.ts");

const myType: import("./other-module.ts").MyType = 5;

function getNumber(value: number): number {
	return value;
}

getNumber(a);
getNumber(maths.pi);
getNumber(mathsOther.pi);
getNumber(a.b);
getNumber(myType);
