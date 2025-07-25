export default {
	printWidth: 80,
	useTabs: true,
	tabWidth: 2,
	trailingComma: "all",
	arrowParens: "always",
	overrides: [
		{
			files: "*.json",
			options: {
				parser: "json",
				useTabs: false,
			},
		},
		{
			files: "*.{cts,mts,ts}",
			options: {
				parser: "typescript",
			},
		},
	],
};
