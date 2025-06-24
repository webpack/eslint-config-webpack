import { defineConfig } from "eslint/config";
import config from "../eslint-config-webpack/index.js";
import configs from "../eslint-config-webpack/configs.js";

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
	},
	{
		files: ["./validation/module-package/**/*"],
		extends: [configs["recommended-module"]],
	},
	{
		files: ["./validation/dirty-package/**/*"],
		extends: [configs["recommended-dirty"]],
	},
]);
