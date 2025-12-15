import getJsonFile from "./get-json-file.js";

/**
 * @returns {boolean} true when typescript is supported by project, otherwise false
 */
function isTypescriptInstalled() {
	const packageJson = getJsonFile("package.json");

	if (packageJson === null) {
		return [];
	}

	const dependencies = packageJson.dependencies || [];
	const devDependencies = packageJson.devDependencies || [];

	return Boolean(
		typeof dependencies.typescript !== "undefined" ||
		typeof devDependencies.typescript !== "undefined",
	);
}

export default isTypescriptInstalled;
