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
