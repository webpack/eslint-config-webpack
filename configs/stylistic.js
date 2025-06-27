import stylisticPlugin from "@stylistic/eslint-plugin";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-plugin-prettier/recommended";

const recommendedConfig = {
	...prettierConfig,
	name: "stylistic/recommended",
	plugins: {
		"@stylistic": stylisticPlugin,
		prettier: prettierPlugin,
	},
	rules: {
		"prettier/prettier": "error",
		curly: ["error", "multi-line", "consistent"],
		"@stylistic/lines-between-class-members": "error",
		"@stylistic/quotes": [
			"error",
			"double",
			{ avoidEscape: true, allowTemplateLiterals: false },
		],
		"@stylistic/spaced-comment": [
			"error",
			"always",
			{
				line: {
					// Space here to support sprockets directives
					markers: ["=", "!"],
					exceptions: ["-", "+"],
				},
				block: {
					// Space here to support sprockets directives
					markers: ["=", "!"],
					exceptions: ["-", "+"],
					balanced: true,
				},
			},
		],
		"@stylistic/padding-line-between-statements": [
			"error",
			{ blankLine: "always", prev: ["cjs-export"], next: "*" },
			{ blankLine: "always", prev: "*", next: ["cjs-export"] },
			{
				blankLine: "any",
				prev: ["cjs-export"],
				next: ["cjs-export"],
			},
			// Require newline between blocks of `cjs-import` and any lines between `cjs-import`
			{ blankLine: "always", prev: ["cjs-import"], next: "*" },
			{ blankLine: "always", prev: "*", next: ["cjs-import"] },
			{
				blankLine: "any",
				prev: ["cjs-import"],
				next: ["cjs-import"],
			},
			// Require newline between blocks of `export` and any lines between `export`
			{ blankLine: "always", prev: ["export"], next: "*" },
			{ blankLine: "always", prev: "*", next: ["export"] },
			{
				blankLine: "any",
				prev: ["export"],
				next: ["export"],
			},
			// Require newline between blocks of `import` and any lines between `import`
			{ blankLine: "always", prev: ["import"], next: "*" },
			{ blankLine: "always", prev: "*", next: ["import"] },
			{
				blankLine: "any",
				prev: ["import"],
				next: ["import"],
			},
			// Require newline after directives
			{ blankLine: "always", prev: ["directive"], next: "*" },
		],
		"@stylistic/lines-around-comment": [
			"error",
			{
				beforeBlockComment: false,
				afterBlockComment: false,
				beforeLineComment: false,
				afterLineComment: false,
				afterHashbangComment: true,
			},
		],
	},
};

export default {
	"stylistic/recommended": recommendedConfig,
};
