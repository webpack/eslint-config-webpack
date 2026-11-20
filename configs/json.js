import jsonPlugin from "@eslint/json";
import unicornPlugin from "eslint-plugin-unicorn";
import packagePlugin from "../plugins/package-json/index.js";

/**
 * @returns {Promise<import("eslint").Linter.Config[]>} config
 */
async function getJsonRecommendedConfig() {
	return [
		{
			name: "json/recommended",
			files: ["**/*.json"],
			ignores: ["**/package-lock.json"],
			plugins: {
				json: jsonPlugin,
				unicorn: unicornPlugin,
				package: packagePlugin,
			},
			language: "json/json",
			rules: {
				...jsonPlugin.configs.recommended.rules,

				// From recommended
				// "json/no-duplicate-keys": "error",

				// From recommended
				// "json/no-empty-keys": "error",

				// From recommended
				// "json/no-unnormalized-keys": "error",

				// From recommended
				// "json/no-unsafe-values": "error",

				// No need
				// "json/sort-keys": "off",

				"json/top-level-interop": "error",

				// `package.json` rules

				"package/order-properties": "error",

				// `unicorn` rules that support JSON and that we use for

				"unicorn/escape-case": "error",

				"unicorn/no-abusive-eslint-disable": "error",

				"unicorn/no-empty-file": "error",

				"unicorn/no-leading-empty-lines": "error",

				"unicorn/no-zero-fractions": "error",

				"unicorn/prefer-escaped-irregular-whitespace": "error",

				"unicorn/prefer-https": "error",

				"unicorn/prefer-literal-ascii": "error",

				"unicorn/prefer-short-escape-sequences": "error",

				"unicorn/no-loss-of-precision": "error",
			},
		},
	];
}

export default {
	"json/recommended": await getJsonRecommendedConfig(),
};
