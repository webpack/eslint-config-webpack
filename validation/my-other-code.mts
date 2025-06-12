import a, { b } from "./other-module.ts";
import maths from "./maths.cts";

function getNumber(value: number): number {
	return value;
}

getNumber(a);
getNumber(maths.pi);
getNumber(b);
