/**
 * @returns {Promise<number>} a number
 */
function load() {
	return Promise.resolve(1);
}

/**
 * @returns {Promise<number>} the loaded number plus one
 */
export async function awaited() {
	const value = await load();

	return value + 1;
}

/**
 * @param {{ name: string }} object an object
 * @returns {string} text
 */
export function stringify(object) {
	return `Name: ${object.name}.`;
}

/**
 * @param {string[]} list a list
 * @returns {string[]} items in upper case
 */
export function upperCase(list) {
	return list.map((item) => item.toUpperCase());
}

/**
 * @param {unknown} value any value
 * @returns {never} never returns
 */
export function throwError(value) {
	throw new Error(`Unexpected value: ${String(value)}`);
}
