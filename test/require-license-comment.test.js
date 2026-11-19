import { describe, it } from "node:test";
import { RuleTester } from "eslint";
import { rule } from "../plugins/webpack/rules/require-license-comment.js";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
	languageOptions: { ecmaVersion: 2022, sourceType: "commonjs" },
});

const header = (url) =>
	`/*\n\tMIT License ${url}\n\tAuthor Tobias Koppers @sokra\n*/\n\n"use strict";\n`;

ruleTester.run("require-license-comment", rule, {
	valid: [
		// eslint-disable-next-line unicorn/prefer-https -- the old header form stays valid
		header("http://www.opensource.org/licenses/mit-license.php"),
		header("https://www.opensource.org/licenses/mit-license.php"),
		'/*\n\tMIT License https://www.opensource.org/licenses/mit-license.php\n*/\n\n"use strict";\n',
	],
	invalid: [
		{
			code: '"use strict";\n',
			errors: [{ message: "Expected license comment." }],
		},
		{
			code: header("httpss://www.opensource.org/licenses/mit-license.php"),
			errors: [{ message: "Expected license comment." }],
		},
		{
			code: '/*\n\tMIT License https://www.opensource.org/licenses/mit-license.php\n*/ "use strict";\n',
			errors: [{ message: "Expected newline after license comment." }],
		},
		{
			code: '/*\n\tMIT License https://www.opensource.org/licenses/mit-license.php\n*/\n"use strict";\n',
			errors: [{ message: "Expected newline after license comment." }],
		},
	],
});
