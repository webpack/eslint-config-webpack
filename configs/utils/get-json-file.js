import fs from "node:fs";
import path from "node:path";

const SKIP_TIME = 5000;

class Cache {
	/**
	 * Initialize this cache instance.
	 */
	constructor() {
		this.map = new Map();
	}

	/**
	 * Get the cached value of the given key.
	 * @param {string} key The key to get.
	 * @returns {import("type-fest").JsonObject} The cached value or null.
	 */
	get(key) {
		const entry = this.map.get(key);
		const now = Date.now();

		if (entry) {
			if (entry.expire > now) {
				entry.expire = now + SKIP_TIME;
				return entry.value;
			}
			this.map.delete(key);
		}
		return null;
	}

	/**
	 * Set the value of the given key.
	 * @param {string} key The key to set.
	 * @param {import("type-fest").JsonObject} value The value to set.
	 * @returns {void}
	 */
	set(key, value) {
		const entry = this.map.get(key);
		const expire = Date.now() + SKIP_TIME;

		if (entry) {
			entry.value = value;
			entry.expire = expire;
		} else {
			this.map.set(key, { value, expire });
		}
	}
}

const cache = new Cache();

/**
 * Reads the `package.json` data in a given path.
 *
 * Don't cache the data.
 * @param {string} dir The path to a directory to read.
 * @param {string} filename The filename.
 * @returns {import("type-fest").JsonObject | null} The read `package.json` data, or null.
 */
function readJsonFile(dir, filename) {
	const filePath = path.join(dir, filename);
	try {
		const text = fs.readFileSync(filePath, "utf8");
		const data = JSON.parse(text);

		if (
			data !== null &&
			typeof data === "object" &&
			Array.isArray(data) === false
		) {
			data.filePath = filePath;
			return data;
		}
		// eslint-disable-next-line unicorn/prefer-optional-catch-binding
	} catch (_err) {
		// do nothing.
	}

	return null;
}

/**
 * Gets a `package.json` data.
 * The data is cached if found, then it's used after.
 * @param {string} filename The filename.
 * @param {string=} startPath A file path to lookup.
 * @returns {import("type-fest").JsonObject | null} A found `package.json` data or `null`.
 * This object have additional property `filePath`.
 */
function getJsonFile(filename, startPath = "a.js") {
	const startDir = path.dirname(path.resolve(startPath));
	let dir = startDir;
	let prevDir = "";
	let data = null;

	do {
		data = cache.get(dir + filename);
		if (data) {
			if (dir !== startDir) {
				cache.set(startDir + filename, data);
			}
			return data;
		}

		data = readJsonFile(dir, filename);
		if (data) {
			cache.set(dir + filename, data);
			cache.set(startDir + filename, data);
			return data;
		}

		// Go to next.
		prevDir = dir;
		dir = path.resolve(dir, "..");
	} while (dir !== prevDir);

	cache.set(startDir + filename, null);
	return null;
}

export default getJsonFile;
