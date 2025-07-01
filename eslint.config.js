import { defineConfig } from "eslint/config";
import configs from "../eslint-config-webpack/configs.js";
import config from "../eslint-config-webpack/index.js";

export default defineConfig([
	{
		ignores: [
			"./validation/commonjs-package/**/*",
			"./validation/module-package/**/*",
			"./validation/dirty-package/**/*",
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
		files: ["./validation/hashbang.js"],
		rules: {
			"n/hashbang": "off",
		},
	},
]);
