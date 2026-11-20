// Each example breaks the rule named in the comment above it, so the lint
// fails if the rule stops reporting. The types come from JSDoc only.

let count = 0;

/**
 * @returns {Promise<number>} a number
 */
function load() {
	return Promise.resolve(1);
}

/**
 * @returns {void}
 */
export function floating() {
	// eslint-disable-next-line @typescript-eslint/no-floating-promises
	load();
}

/**
 * @param {number} value a number
 * @returns {Promise<number>} the same number
 */
export async function awaitNumber(value) {
	// eslint-disable-next-line @typescript-eslint/await-thenable
	return await value;
}

/**
 * @returns {void}
 */
export function misused() {
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	if (load()) {
		count += 1;
	}
}

/**
 * @param {{ name: string }} object an object
 * @returns {string} text
 */
export function stringify(object) {
	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
	return `Object: ${object}.`;
}

/**
 * @param {string[]} list a list
 * @returns {string[]} indexes
 */
export function indexes(list) {
	const result = [];

	// eslint-disable-next-line @typescript-eslint/no-for-in-array
	for (const index in list) {
		result.push(index);
	}

	return result;
}

/**
 * @returns {never} never returns
 */
export function throwString() {
	// eslint-disable-next-line @typescript-eslint/only-throw-error
	throw "error";
}

/**
 * @returns {Promise<number>} the count
 */
// eslint-disable-next-line @typescript-eslint/require-await
export async function noAwait() {
	return count;
}
