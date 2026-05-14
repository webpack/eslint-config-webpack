import { defineConfig } from "eslint/config";
import configs from "./configs.js";
import config from "./index.js";

export default defineConfig([
	{
		ignores: [
			"./validation/commonjs-package/**/*",
			"./validation/module-package/**/*",
			"./validation/dirty-package/**/*",
			"./validation/browser/**/*",
			"./validation/browser-es5/**/*",
			"./validation/browser-outdated/**/*",
			"./validation/universal/**/*",
		],
		extends: [config],
	},
	// For test purposes
	{
		files: ["./validation/commonjs-package/**/*"],
		extends: [configs["node-recommended-commonjs"]],
		rules: {
			"n/no-unpublished-require": "off",
		},
	},
	{
		files: ["./validation/module-package/**/*"],
		extends: [configs["node-recommended-module"]],
		rules: {
			"n/no-unpublished-require": "off",
		},
	},
	{
		// Our own engines.node is >=20.9.0, which pins the shared config at
		// ecmaVersion 2023. The import-attributes fixture exercises ES2025
		// syntax (`with { type: "json" }`), so simulate a Node 22+ project
		// here — that's what `get-es-version-from-node.js` produces for
		// `engines.node: ">=22"`.
		files: ["./validation/module-package/import-attributes.js"],
		languageOptions: { ecmaVersion: 2025 },
	},
	{
		files: ["./validation/dirty-package/**/*"],
		extends: [configs["node-recommended-dirty"]],
		rules: {
			"n/no-unpublished-require": "off",
		},
	},
	{
		files: ["./validation/browser/**/*"],
		extends: [configs["browser-recommended"]],
	},
	{
		files: ["./validation/browser-es5/**/*"],
		extends: [configs["browser-outdated-recommended-script"]],
		rules: {
			"n/no-unpublished-require": "off",
		},
	},
	{
		files: ["./validation/browser-outdated/**/*"],
		extends: [configs["browser-outdated-recommended"]],
	},
	{
		files: ["./validation/universal/**/*"],
		extends: [configs["universal-recommended"]],
		rules: {
			"n/no-unsupported-features/node-builtins": "off",
		},
	},
	{
		files: ["./validation/hashbang.js"],
		rules: {
			"n/hashbang": "off",
		},
	},
	{
		files: ["./validation/webpack/**/*"],
		extends: [configs["node-recommended-commonjs"], configs["webpack/special"]],
	},
]);
