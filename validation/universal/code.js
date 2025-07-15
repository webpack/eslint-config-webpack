/**
 * @param {URL} url url
 * @returns {Promise<Response>} result
 */
async function readFile(url) {
	if (globalThis === globalThis.global) {
		const fs = (await import("node:fs")).default;

		return fs.promises.readFile(url, "utf8");
	}

	const response = await fetch(url);

	return response.text();
}

/**
 * @returns {Promise<[number, number, number]>} random numbers
 */
async function getRandomNumbers() {
	const crypto =
		globalThis === globalThis.global
			? (await import("node:crypto")).webcrypto
			: globalThis.crypto;

	const array = new Uint8Array(3);
	const randomNumbers = crypto.getRandomValues(array);

	return [randomNumbers[0], randomNumbers[1], randomNumbers[2]];
}

let content;

try {
	content = await readFile(new URL("file.txt", import.meta.url));
} catch (err) {
	throw new Error("Error fetching data", { cause: err });
}

/**
 * @returns {Promise<number>} number
 */
async function loadModule() {
	if (globalThis === globalThis.global) {
		const { createRequire } = await import("node:module");
		const require = createRequire(import.meta.url);

		return require("./module.cjs");
	}

	const module = (await import("./module.mjs")).default;

	return module;
}

/**
 * @returns {string} title
 */
function getTitle() {
	return (globalThis.process && process.title) || document.title;
}

// eslint-disable-next-line
console.log(content);
// eslint-disable-next-line
console.log(await getRandomNumbers());
// eslint-disable-next-line
console.log(await loadModule());
// eslint-disable-next-line
console.log(getTitle());
