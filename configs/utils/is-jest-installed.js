import getJsonFile from "./get-json-file.js";

/**
 * @returns {boolean} true when jest is supported by project, otherwise false
 */
function isTypescriptInstalled() {
	/** @type {import("type-fest").PackageJson | null} */
	const packageJson = getJsonFile("package.json");

	if (packageJson === null) {
		return false;
	}

	const dependencies = packageJson.dependencies || {};
	const devDependencies = packageJson.devDependencies || {};

	return (
		typeof dependencies.jest !== "undefined" ||
		typeof devDependencies.jest !== "undefined"
	);
}

export default isTypescriptInstalled;
