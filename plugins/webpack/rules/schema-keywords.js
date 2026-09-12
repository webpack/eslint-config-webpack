// The one vocabulary `webpack/valid-schema` and `webpack/format-schema` share:
// keeping them in separate lists is how the two drifted apart.

// Key order inside every schema object. A keyword absent from here sorts
// alphabetically after these.
export const KEYWORD_ORDER = [
	"$ref",
	"definitions",
	"$id",
	"id",
	"title",
	"description",
	"type",
	"cli",
	"items",
	"minItems",
	"uniqueItems",
	"implements",
	"additionalProperties",
	"properties",
	"required",
	"minProperties",
	"oneOf",
	"anyOf",
	"allOf",
	"enum",
	"absolutePath",
	"undefinedAsNull",
	"minLength",
	"minimum",
	"instanceof",
	"tsType",
	"deprecated",
	"experimental",
	"added",
];

// Valid keywords with no fixed position, so they sort alphabetically among
// themselves after the ordered ones.
const UNORDERED_KEYWORDS = ["link", "maximum", "not", "pattern"];

// The draft-04 spelling of `$id`, which the generators do not read. It keeps
// its slot in the order so a schema carrying it still formats predictably.
const REJECTED_KEYWORDS = new Set(["id"]);

export const DEFAULT_KEYWORDS = [
	...KEYWORD_ORDER.filter((keyword) => !REJECTED_KEYWORDS.has(keyword)),
	...UNORDERED_KEYWORDS,
];
