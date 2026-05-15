// Verifies our config can parse ES2025 JSON import attributes
// (`with { type: "json" }`). Executing this file on Node 22+ also
// proves the attribute is valid at runtime, not just parse-time.
import pkg from "./package.json" with { type: "json" };

/**
 * @returns {string} package name
 */
export function getPackageName() {
	return pkg.name;
}

getPackageName();
