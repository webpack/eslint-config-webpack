import { configs } from "../plugins/webpack/index.js";

const recommendedWebpackSpecialConfig = {
	...configs.recommended,
};

export default {
	"webpack/special": recommendedWebpackSpecialConfig,
};
