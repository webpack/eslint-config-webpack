import { defineConfig } from "eslint/config";
import configs from "../eslint-config-webpack/configs.js";
import config from "../eslint-config-webpack/index.js";

export default defineConfig([
	{
		ignores: [
			"./validation/commonjs-package/**/*",
			"./validation/module-package/**/*",
			"./validation/dirty-package/**/*",
			"./validation/browser/**/*",
			"./validation/browser-outdated/**/*",
			"./validation/universal/**/*",
		],
		extends: [config],
	},
	// For test purposes
	{
		files: ["./validation/commonjs-package/**/*"],
		extends: [configs["recommended-commonjs"]],
		rules: {
			"n/no-unpublished-require": "off",
		},
	},
	{
		files: ["./validation/module-package/**/*"],
		extends: [configs["recommended-module"]],
		rules: {
			"n/no-unpublished-require": "off",
		},
	},
	{
		files: ["./validation/dirty-package/**/*"],
		extends: [configs["recommended-dirty"]],
		rules: {
			"n/no-unpublished-require": "off",
		},
	},
	{
		files: ["./validation/browser/**/*"],
		extends: [configs["browser-recommended"]],
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
	// For test purposes
	{
		files: ["./validation/webpack/**/*"],
		extends: [configs["recommended-commonjs"], configs["webpack/special"]],
	},
]);
