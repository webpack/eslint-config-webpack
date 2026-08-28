/** @typedef {import("eslint").SourceCode} SourceCode */
/** @typedef {import("estree").Comment} Comment */

/**
 * @typedef {object} ImportBinding
 * @property {string} text binding as written, e.g. `Foo` or `Foo as Bar`
 * @property {string} local name the binding introduces in the file
 * @property {number} start absolute offset of the binding in the source
 * @property {number} end absolute offset just past the binding
 */

/**
 * @typedef {object} ImportTag
 * @property {Comment} comment JSDoc comment the tag is written in
 * @property {string} moduleRequest module the types are imported from
 * @property {ImportBinding | undefined} head default or `* as ns` binding, when present
 * @property {boolean} namespace whether `head` is a `* as ns` binding
 * @property {ImportBinding[]} named bindings inside the braces
 * @property {number} start absolute offset of `@import`
 * @property {number} end absolute offset just past the module string
 */

const IMPORT_TAG = /@import[ \t]+([\s\S]*?)[ \t]+from[ \t]+(["'])([^"']+)\2/g;
const NAMESPACE_BINDING = /\*[ \t\n]*as[ \t\n]+([A-Za-z_$][\w$]*)/;
const DEFAULT_BINDING = /[A-Za-z_$][\w$]*/;

/**
 * Blanks out the `*` opening each JSDoc line, keeping every offset intact so
 * matches on the result still address the original source.
 * @param {string} text raw comment body
 * @returns {string} the body with its line markers replaced by spaces
 */
export const stripLineMarkers = (text) =>
	text.replace(/^[ \t]*\*/gm, (marker) => " ".repeat(marker.length));

/**
 * @param {string} binding binding as written, `Name` or `Name as Alias`
 * @returns {string} the local name it introduces
 */
export const localNameOf = (binding) => {
	const parts = binding.split(/[ \t\n]+as[ \t\n]+/);
	return parts[parts.length - 1].trim();
};

/**
 * @param {string} inner text between the braces of a named-import clause
 * @param {number} innerStart absolute offset of that text
 * @returns {ImportBinding[]} one entry per binding
 */
const parseNamedBindings = (inner, innerStart) => {
	/** @type {ImportBinding[]} */
	const bindings = [];
	let offset = 0;

	for (const part of inner.split(",")) {
		const text = part.trim();

		if (text !== "") {
			const start = innerStart + offset + part.indexOf(text);

			bindings.push({
				text,
				local: localNameOf(text),
				start,
				end: start + text.length,
			});
		}

		offset += part.length + 1;
	}

	return bindings;
};

/**
 * Reads every `@import` tag of one JSDoc comment.
 * @param {Comment} comment the comment to read
 * @returns {ImportTag[]} the tags it holds, in source order
 */
export const parseImportTags = (comment) => {
	if (comment.type !== "Block" || !comment.value.startsWith("*")) {
		return [];
	}

	const range = /** @type {[number, number]} */ (comment.range);
	// `/*` sits before the value, so an index into it is `range[0] + 2` in the source
	const base = range[0] + 2;
	const body = stripLineMarkers(comment.value);
	/** @type {ImportTag[]} */
	const tags = [];

	IMPORT_TAG.lastIndex = 0;

	let match;

	while ((match = IMPORT_TAG.exec(body)) !== null) {
		const [text, clause, , moduleRequest] = match;
		const clauseStart = base + match.index + text.indexOf(clause);
		const braced = /\{([^}]*)\}/.exec(clause);
		const named =
			braced === null
				? []
				: parseNamedBindings(braced[1], clauseStart + braced.index + 1);
		const outer = braced === null ? clause : clause.slice(0, braced.index);
		const namespaced = NAMESPACE_BINDING.exec(outer);
		const head = namespaced === null ? DEFAULT_BINDING.exec(outer) : namespaced;

		tags.push({
			comment,
			moduleRequest,
			head:
				head === null
					? undefined
					: {
							text: head[0],
							local: namespaced === null ? head[0] : head[1],
							start: clauseStart + head.index,
							end: clauseStart + head.index + head[0].length,
					  },
			namespace: namespaced !== null,
			named,
			start: base + match.index,
			end: base + match.index + text.length,
		});
	}

	return tags;
};

/**
 * @param {SourceCode} sourceCode source being linted
 * @returns {ImportTag[]} every `@import` tag in the file, in source order
 */
export const collectImportTags = (sourceCode) =>
	sourceCode.getAllComments().flatMap((comment) => parseImportTags(comment));
