import { defineConfig } from "eslint/config";
import config from "../eslint-config-webpack/index.js";

export default defineConfig([
	{
		extends: [config],
	},
]);
