import globals from "globals";

const recommendedBrowserConfig = {
	languageOptions: {
		globals: {
			...globals.browser,
		},
	},
};

export default {
	"browser/recommended": recommendedBrowserConfig,
};
