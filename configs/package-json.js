import { configs } from "../plugins/package-json/index.js";

const recommendedBrowserConfig = {
	...configs.recommended,
};

export default {
	"package-json/recommended": recommendedBrowserConfig,
};
