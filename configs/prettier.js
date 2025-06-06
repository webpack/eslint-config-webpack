import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-plugin-prettier/recommended";
import stylisticPlugin from "@stylistic/eslint-plugin";

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
	},
};

export default {
	"stylistic/recommended": recommendedConfig,
};
