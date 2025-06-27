import maths from "./maths.cts";
import a, { b } from "./other-module.ts";

function getNumber(value: number): number {
	return value;
}

getNumber(a);
getNumber(maths.pi);
getNumber(b);
