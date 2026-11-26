import fs from "node:fs";
import path from "node:path";
import {
	collectImportTags,
	parseImportTags,
	stripLineMarkers,
} from "../utils/import-tags.js";

/** @import { Rule, SourceCode } from "eslint" */
/** @import { Comment, Node, SourceLocation } from "estree" */
/** @import { ImportBinding, ImportTag } from "../utils/import-tags.js" */

// A `@typedef` that is nothing but an import — `{import("m")}` or `{import("m").Name}`
// — and carries no description. Anything richer (a generic instantiation, an indexed
// access, an intersection) cannot be written as `@import`, so it is left alone.
const PLAIN_IMPORT_TYPEDEF =
	/@typedef[ \t]*\{[ \t]*import\((["'])([^"']+)\1\)(?:\.([A-Za-z_$][\w$]*))?[ \t]*\}[ \t]+([A-Za-z_$][\w$]*)[ \t]*(?=\r?\n|$)/g;

// Probed in TypeScript's resolution order; a `.ts` source is written as `.js`,
// since TypeScript rejects a `.ts` path unless `allowImportingTsExtensions` is on
const CANDIDATES = [
	[".ts", ".js"],
	[".d.ts", ".d.ts"],
	[".js", ".js"],
];

const RELATIVE_REQUEST = /^\.\.?(?:\/|$)/;

/**
 * @param {string} file absolute path
 * @returns {boolean} true when a file (not a directory) is there
 */
const isFile = (file) => {
	try {
		return fs.statSync(file).isFile();
	} catch {
		return false;
	}
};

/**
 * Finds the extension a relative request that names no file as written needs.
 * @param {string} directory directory of the linted file
 * @param {string} request relative module request as written
 * @returns {string | undefined} the request with its extension, or undefined when nothing matches
 */
const resolveWithExtension = (directory, request) => {
	const absolute = path.resolve(directory, request);

	if (isFile(absolute)) {
		return undefined;
	}

	for (const [prefix, base] of [
		["", absolute],
		["/index", path.join(absolute, "index")],
	]) {
		for (const [extension, written] of CANDIDATES) {
			if (isFile(`${base}${extension}`)) {
				return `${request.replace(/\/$/, "")}${prefix}${written}`;
			}
		}
	}

	return undefined;
};

// #region inline imports

// Tags whose `{…}` holds a type; `@tsType`, `@example` and prose stay untouched
const TYPE_TAGS = new Set([
	"arg",
	"argument",
	"augments",
	"enum",
	"exception",
	"extends",
	"implements",
	"param",
	"prop",
	"property",
	"return",
	"returns",
	"satisfies",
	"template",
	"this",
	"throws",
	"type",
	"typedef",
	"yield",
	"yields",
]);

const TAG = /(?<![\w${])@([A-Za-z]+)/g;
const IDENTIFIER = /[A-Za-z_$][\w$]*/g;
const INLINE_IMPORT =
	/(?<![\w$.])import\([ \t\n]*(["'])([^"'\n]+)\1[ \t\n]*\)((?:\.[A-Za-z_$][\w$]*)*)/g;
const PLAIN_TYPEDEF_LINE =
	/^@typedef[ \t]*\{[ \t]*import\((["'])([^"']+)\1\)(?:\.([A-Za-z_$][\w$]*))?(?:<([^<>{}]*)>)?[ \t]*\}[ \t]+([A-Za-z_$][\w$]*)(?:<([^<>{}]*)>)?$/;
const TEMPLATE_LINE =
	/^@template[ \t]+([A-Za-z_$][\w$]*(?:[ \t]*,[ \t]*[A-Za-z_$][\w$]*)*)$/;

// Names JSDoc reads as its own types, which an import must never shadow
const JSDOC_BUILT_INS = [
	"Array",
	"BigInt",
	"Boolean",
	"Function",
	"Number",
	"Object",
	"Promise",
	"String",
	"Symbol",
];

/**
 * @typedef {object} TypeRegion
 * @property {number} start offset in the stripped comment body
 * @property {number} end offset just past it
 * @property {string} tag the tag the type belongs to
 */

/**
 * @typedef {object} PlainTypedef
 * @property {string} moduleRequest module the alias imports from
 * @property {string | undefined} exportName named export, or undefined for the module
 * @property {string} alias the name the typedef declares
 */

/**
 * @typedef {object} NewImport
 * @property {string} moduleRequest the module as the new tag writes it
 * @property {string | undefined} head default binding
 * @property {string[]} named bindings as written, e.g. `Foo` or `Foo as Bar`
 */

/**
 * @typedef {object} Site
 * @property {number} start absolute offset of the `import(…)`
 * @property {number} end absolute offset just past its member chain
 * @property {string} request module request as written
 * @property {string[]} members the member chain after it
 */

/**
 * @typedef {object} Edit
 * @property {[number, number]} range what to replace
 * @property {string} text what to write there
 */

/**
 * @param {string} body stripped comment body
 * @param {number} open offset of an opening `{` or `[`
 * @returns {number} offset just past the bracket that closes it, or -1
 */
const closingOf = (body, open) => {
	const opening = body[open];
	const closing = opening === "{" ? "}" : "]";
	let depth = 0;

	for (let i = open; i < body.length; i++) {
		if (body[i] === opening) {
			depth++;
		} else if (body[i] === closing && --depth === 0) {
			return i + 1;
		}
	}

	return -1;
};

/**
 * @param {string} body stripped comment body
 * @param {number} at an offset in it
 * @returns {number} the first offset from there that is not white space
 */
const skipSpace = (body, at) => {
	let next = at;

	while (/\s/.test(body[next] || "")) next++;

	return next;
};

/**
 * Finds every type a comment states: the `{…}` after a type tag, and the
 * default of a `@template [T=…]`.
 * @param {string} body stripped comment body
 * @returns {TypeRegion[]} the types, in source order
 */
const typeRegionsOf = (body) => {
	/** @type {TypeRegion[]} */
	const regions = [];

	TAG.lastIndex = 0;

	let match;

	while ((match = TAG.exec(body)) !== null) {
		const [, tag] = match;

		if (!TYPE_TAGS.has(tag)) {
			continue;
		}

		let at = skipSpace(body, match.index + match[0].length);

		if (body[at] === "{") {
			const end = closingOf(body, at);

			if (end === -1) {
				continue;
			}

			regions.push({ start: at, end, tag });
			at = skipSpace(body, end);
		}

		if (tag === "template" && body[at] === "[") {
			const end = closingOf(body, at);

			if (end !== -1) {
				regions.push({ start: at, end, tag });
			}
		}
	}

	return regions;
};

/**
 * Reads a comment that holds nothing but alias typedefs: one, generic over its
 * own template names in order, or several plain ones.
 * @param {string} body stripped comment body
 * @returns {PlainTypedef[] | undefined} the aliases, or undefined when it holds more
 */
const plainTypedefsOf = (body) => {
	const lines = body
		.slice(1)
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean);
	/** @type {string[]} */
	const templates = [];
	/** @type {PlainTypedef[]} */
	const typedefs = [];

	for (const line of lines) {
		const template = TEMPLATE_LINE.exec(line);

		if (template !== null && typedefs.length === 0) {
			templates.push(...template[1].split(",").map((name) => name.trim()));
			continue;
		}

		const typedef = PLAIN_TYPEDEF_LINE.exec(line);

		if (typedef === null) {
			return undefined;
		}

		const [, , moduleRequest, exportName, args, alias, aliasArgs] = typedef;
		const written = args === undefined ? "" : args.replaceAll(/\s/g, "");

		if (
			written !== templates.join(",") ||
			(aliasArgs !== undefined &&
				aliasArgs.replaceAll(/\s/g, "") !== written) ||
			(templates.length > 0 && typedefs.length > 0)
		) {
			return undefined;
		}

		typedefs.push({ moduleRequest, exportName, alias });
	}

	return typedefs.length > 0 ? typedefs : undefined;
};

/**
 * @param {string} name a file or package name
 * @returns {string} it as an identifier: `syntax-parser` → `syntaxParser`
 */
const toIdentifier = (name) => {
	const joined = name
		.split(/[^\w$]+/)
		.filter(Boolean)
		.map((word, index) =>
			index === 0 ? word : `${word[0].toUpperCase()}${word.slice(1)}`,
		)
		.join("");

	return /^\d/.test(joined) ? `_${joined}` : joined;
};

/**
 * @param {string} request module request as written
 * @param {string=} resolved the file it names, when known
 * @returns {string} the name a default import of the module takes
 */
const moduleNameOf = (request, resolved = request) => {
	const segments = resolved
		.split(/[\\/]/)
		.filter((segment) => segment !== "" && segment !== "." && segment !== "..");
	let last = (segments.at(-1) || "module").replace(
		/\.(?:d\.)?[cm]?[jt]s$|\.json$/,
		"",
	);

	if (last === "index" && segments.length > 1) {
		last = /** @type {string} */ (segments.at(-2));
	}

	return toIdentifier(last) || "module";
};

/**
 * @param {string} name a name
 * @returns {string} it with its first letter upper case
 */
const capitalize = (name) => `${name[0].toUpperCase()}${name.slice(1)}`;

/**
 * @param {Node | null | undefined} node an expression
 * @returns {boolean} true for `require("…")`, or a member read off one
 */
const isRequire = (node) => {
	let current = node;

	while (current && current.type === "MemberExpression") {
		current = current.object;
	}

	return Boolean(
		current &&
		current.type === "CallExpression" &&
		current.callee.type === "Identifier" &&
		current.callee.name === "require",
	);
};

/**
 * @param {Node} statement a top-level statement
 * @returns {boolean} true for what a header holds: directives, `import`s and `require`s
 */
const isHeaderStatement = (statement) => {
	if (statement.type === "ImportDeclaration") {
		return true;
	}

	if (statement.type === "ExpressionStatement") {
		return "directive" in statement;
	}

	return (
		statement.type === "VariableDeclaration" &&
		statement.declarations.every((declarator) => isRequire(declarator.init))
	);
};

/**
 * @param {Comment | Node} node a comment or a node
 * @returns {[number, number]} its range
 */
const rangeOf = (node) => /** @type {[number, number]} */ (node.range);

/**
 * @typedef {object} LocalAlias
 * @property {string} moduleRequest the module the name really comes from, as the file writes it
 * @property {string | undefined} exportName the export there, or undefined for the module
 */

/** @type {Map<string, { mtime: number, aliases: Map<string, LocalAlias> }>} */
const localAliasCache = new Map();

/**
 * The names a module binds without exporting them: what its `@import` tags
 * bind, and what its plain alias typedefs, which the fix turns into those, name.
 * @param {string} file absolute path of the module
 * @returns {Map<string, LocalAlias>} each such name and where it comes from
 */
const localAliasesOf = (file) => {
	/** @type {number} */
	let mtime;

	try {
		mtime = fs.statSync(file).mtimeMs;
	} catch {
		return new Map();
	}

	const cached = localAliasCache.get(file);

	if (cached !== undefined && cached.mtime === mtime) {
		return cached.aliases;
	}

	/** @type {Map<string, LocalAlias>} */
	const aliases = new Map();
	const source = fs.readFileSync(file, "utf8");

	for (const match of source.matchAll(/\/\*\*[\s\S]*?\*\//g)) {
		const start = /** @type {number} */ (match.index);
		const value = match[0].slice(2, -2);
		/** @type {Comment} */
		const comment = {
			type: "Block",
			value,
			range: [start, start + match[0].length],
		};

		for (const tag of parseImportTags(comment)) {
			if (tag.head !== undefined && !tag.namespace) {
				aliases.set(tag.head.local, {
					moduleRequest: tag.moduleRequest,
					exportName: undefined,
				});
			}

			for (const binding of tag.named) {
				const [exported] = binding.text.split(/[ \t\n]+as[ \t\n]+/, 1);

				aliases.set(binding.local, {
					moduleRequest: tag.moduleRequest,
					exportName: exported.trim(),
				});
			}
		}

		for (const typedef of plainTypedefsOf(stripLineMarkers(value)) || []) {
			aliases.set(typedef.alias, typedef);
		}
	}

	localAliasCache.set(file, { mtime, aliases });

	return aliases;
};

/**
 * @param {string} directory directory a request is relative to
 * @param {string} request module request as written
 * @returns {string | undefined} the file it names, when there is one
 */
const fileOf = (directory, request) => {
	if (!RELATIVE_REQUEST.test(request)) {
		return undefined;
	}

	const absolute = path.resolve(directory, request);

	if (isFile(absolute)) {
		return absolute;
	}

	const fixed = resolveWithExtension(directory, request);

	return fixed === undefined ? undefined : path.resolve(directory, fixed);
};

/**
 * Follows a named import to the module that exports it, past every module that
 * only imports or aliases the name itself.
 * @param {string} from absolute path of the importing file
 * @param {string} request module request as written there
 * @param {string | undefined} exportName the name it imports
 * @returns {LocalAlias | undefined} the origin, as `from` reaches it, when it is not `request`
 */
const originOf = (from, request, exportName) => {
	let directory = path.dirname(from);
	let current = { moduleRequest: request, exportName };
	let moved = false;

	for (let depth = 0; depth < 8 && current.exportName !== undefined; depth++) {
		const file = fileOf(directory, current.moduleRequest);

		if (file === undefined || file === from) {
			break;
		}

		const alias = localAliasesOf(file).get(current.exportName);

		if (alias === undefined) {
			break;
		}

		current = alias;
		directory = path.dirname(file);
		moved = true;

		if (RELATIVE_REQUEST.test(alias.moduleRequest)) {
			const target = path.resolve(directory, alias.moduleRequest);
			const relative = path
				.relative(path.dirname(from), target)
				.split(path.sep)
				.join("/");

			current = {
				moduleRequest: relative.startsWith(".") ? relative : `./${relative}`,
				exportName: alias.exportName,
			};
			directory = path.dirname(from);
		}
	}

	return moved ? current : undefined;
};

/**
 * The ranges an `eslint-disable` comment turns a rule off in.
 * @param {SourceCode} sourceCode source being linted
 * @param {string} ruleId the rule's id as configured
 * @returns {[number, number][]} each disabled range, from its start up to its end
 */
const disabledRangesOf = (sourceCode, ruleId) => {
	const text = sourceCode.getText();
	/** @type {[number, number][]} */
	const ranges = [];
	/** @type {number | undefined} */
	let openAt;

	/**
	 * @param {number} line one-based line number
	 * @returns {number} the offset that line starts at, or the end of the text
	 */
	const lineStart = (line) =>
		line > sourceCode.lines.length
			? text.length
			: sourceCode.getIndexFromLoc({ line, column: 0 });

	// `getDisableDirectives` is public since ESLint 9, but missing from its types
	const { directives } =
		/** @type {SourceCode & { getDisableDirectives: () => { directives: { type: string, value: string, node: Comment }[] } }} */ (
			sourceCode
		).getDisableDirectives();

	for (const { type, value, node } of directives) {
		if (value !== "" && !value.split(/\s*,\s*/).includes(ruleId)) {
			continue;
		}

		const [start, end] = rangeOf(node);
		const { loc } = /** @type {Comment & { loc: SourceLocation }} */ (node);

		if (type === "disable") {
			openAt = openAt === undefined ? end : openAt;
		} else if (type === "enable") {
			if (openAt !== undefined) {
				ranges.push([openAt, start]);
				openAt = undefined;
			}
		} else {
			const line = type === "disable-line" ? loc.start.line : loc.end.line + 1;

			ranges.push([lineStart(line), lineStart(line + 1)]);
		}
	}

	if (openAt !== undefined) {
		ranges.push([openAt, text.length]);
	}

	return ranges;
};

/**
 * Reports every inline `import()` of a file, all carrying one fix that rewrites
 * them together, so `--fix` needs one pass however many there are.
 * @param {Rule.RuleContext} context rule context
 * @param {boolean} typedefs whether typedefs are checked too
 * @param {(request: string) => string | undefined} withExtension the request with its extension, when it lacks one
 * @returns {void}
 */
const reportInlineImports = (context, typedefs, withExtension) => {
	const { sourceCode, filename } = context;
	const text = sourceCode.getText();
	const directory = path.isAbsolute(filename)
		? path.dirname(filename)
		: undefined;

	/**
	 * @param {string} request module request as written
	 * @returns {string | undefined} the file a relative request names
	 */
	const resolve = (request) => {
		if (directory === undefined || !RELATIVE_REQUEST.test(request)) {
			return undefined;
		}

		const absolute = path.resolve(directory, request);
		const fixed = isFile(absolute)
			? undefined
			: resolveWithExtension(directory, request);

		return fixed === undefined ? absolute : path.resolve(directory, fixed);
	};

	/**
	 * @param {string} request module request as written
	 * @returns {string} what identifies the module, however it is written
	 */
	const moduleKey = (request) => resolve(request) || request;

	/**
	 * @param {string} key module key
	 * @param {string=} exportName named export, or none for the module
	 * @returns {string} the binding key
	 */
	const bindingKey = (key, exportName = "") => `${key}#${exportName}`;

	/** @type {Map<string, string>} binding key to local name */
	const bindings = new Map();
	/** @type {Map<string, string>} module key to namespace binding */
	const namespaces = new Map();
	/** @type {Set<string>} */
	const used = new Set(JSDOC_BUILT_INS);

	/**
	 * @param {string} key binding key
	 * @param {string} local local name
	 * @returns {void}
	 */
	const bind = (key, local) => {
		if (!bindings.has(key)) {
			bindings.set(key, local);
		}

		used.add(local);
	};

	for (const scope of sourceCode.scopeManager.scopes) {
		for (const variable of scope.variables) {
			used.add(variable.name);
		}

		for (const reference of scope.through) {
			used.add(reference.identifier.name);
		}
	}

	for (const statement of sourceCode.ast.body) {
		if (statement.type !== "VariableDeclaration") {
			continue;
		}

		for (const { id, init } of statement.declarations) {
			if (
				!init ||
				init.type !== "CallExpression" ||
				!isRequire(init) ||
				init.arguments.length !== 1 ||
				init.arguments[0].type !== "Literal" ||
				typeof init.arguments[0].value !== "string"
			) {
				continue;
			}

			const key = moduleKey(init.arguments[0].value);

			if (id.type === "Identifier") {
				bind(bindingKey(key, undefined), id.name);
			} else if (id.type === "ObjectPattern") {
				for (const property of id.properties) {
					if (
						property.type === "Property" &&
						!property.computed &&
						property.key.type === "Identifier" &&
						property.value.type === "Identifier"
					) {
						bind(bindingKey(key, property.key.name), property.value.name);
					}
				}
			}
		}
	}

	const importTags = collectImportTags(sourceCode);
	/** @type {{ tag: ImportTag, binding: ImportBinding, origin: LocalAlias }[]} bindings of a name the module does not export */
	const stale = [];
	/** @type {(Edit & { origin: string })[]} kept typedefs, pointed at where their name comes from */
	const retargets = [];

	for (const tag of importTags) {
		const key = moduleKey(tag.moduleRequest);

		if (tag.head && tag.namespace) {
			namespaces.set(key, tag.head.local);
			used.add(tag.head.local);
		} else if (tag.head) {
			bind(bindingKey(key, undefined), tag.head.local);
		}

		for (const binding of tag.named) {
			const exported = binding.text.split(/[ \t\n]+as[ \t\n]+/, 1)[0].trim();
			const origin =
				directory === undefined
					? undefined
					: originOf(filename, tag.moduleRequest, exported);

			if (origin === undefined) {
				bind(bindingKey(key, exported), binding.local);
			} else {
				stale.push({ tag, binding, origin });
				bind(
					bindingKey(moduleKey(origin.moduleRequest), origin.exportName),
					binding.local,
				);
			}
		}
	}

	/** @type {Site[]} */
	const sites = [];
	/** @type {{ comment: Comment, typedefs: PlainTypedef[] }[]} */
	const plainComments = [];
	/** @type {Set<string>} binding keys a typedef of the same name specializes */
	const specialized = new Set();

	for (const comment of sourceCode.getAllComments()) {
		if (comment.type !== "Block" || !comment.value.startsWith("*")) {
			continue;
		}

		const base = rangeOf(comment)[0] + 2;
		const body = stripLineMarkers(comment.value);
		const plain = typedefs ? plainTypedefsOf(body) : undefined;

		if (plain !== undefined) {
			plainComments.push({ comment, typedefs: plain });
			continue;
		}

		for (const region of typeRegionsOf(body)) {
			const type = body.slice(region.start, region.end);
			const declared = /^\s*([A-Za-z_$][\w$]*)/.exec(body.slice(region.end));

			for (const match of type.matchAll(INLINE_IMPORT)) {
				const [whole, , written, chain] = match;
				const start = base + region.start + /** @type {number} */ (match.index);
				const writtenMembers = chain === "" ? [] : chain.slice(1).split(".");
				const origin =
					directory === undefined || writtenMembers.length === 0
						? undefined
						: originOf(filename, written, writtenMembers[0]);
				const request = origin === undefined ? written : origin.moduleRequest;
				const members =
					origin === undefined
						? writtenMembers
						: [
								.../** @type {string[]} */ (
									origin.exportName === undefined ? [] : [origin.exportName]
								),
								...writtenMembers.slice(1),
							];

				if (region.tag === "typedef" && !typedefs) {
					if (origin !== undefined) {
						retargets.push({
							range: [start, start + whole.length],
							text: [`import(${JSON.stringify(request)})`, ...members].join(
								".",
							),
							origin: request,
						});
					}

					continue;
				}

				sites.push({ start, end: start + whole.length, request, members });

				if (
					region.tag === "typedef" &&
					declared !== null &&
					declared[1] === members[0]
				) {
					specialized.add(bindingKey(moduleKey(request), members[0]));
				}
			}

			for (const [name] of type
				.replaceAll(INLINE_IMPORT, " ")
				.matchAll(IDENTIFIER)) {
				used.add(name);
			}
		}

		for (const [, name] of body.matchAll(
			/@(?:typedef[ \t]*(?:\{[\s\S]*?\}[ \t]*)?|callback[ \t]+)([A-Za-z_$][\w$]*)/g,
		)) {
			used.add(name);
		}

		for (const [, names] of body.matchAll(
			/@template[ \t]+(?:\{[^}\n]*\}[ \t]*)?([^\n]*)/g,
		)) {
			for (const [name] of names
				.replaceAll(/[=][^,\]]*/g, "")
				.matchAll(IDENTIFIER)) {
				used.add(name);
			}
		}
	}

	// What an `eslint-disable` covers stays as written: one fix rewrites the whole
	// file, and would otherwise reach it through a report outside the range
	const disabled = disabledRangesOf(sourceCode, context.id);

	/**
	 * @template T
	 * @param {T[]} items what was found
	 * @param {(item: T) => number} offsetOf where one item starts
	 * @returns {void}
	 */
	const dropDisabled = (items, offsetOf) => {
		for (let i = items.length - 1; i >= 0; i--) {
			const offset = offsetOf(items[i]);

			if (disabled.some(([start, end]) => offset >= start && offset < end)) {
				items.splice(i, 1);
			}
		}
	};

	dropDisabled(sites, (site) => site.start);
	dropDisabled(plainComments, ({ comment }) => rangeOf(comment)[0]);
	dropDisabled(stale, ({ binding }) => binding.start);
	dropDisabled(retargets, ({ range }) => range[0]);

	if (
		sites.length === 0 &&
		plainComments.length === 0 &&
		stale.length === 0 &&
		retargets.length === 0
	) {
		return;
	}

	/** @type {Map<string, NewImport>} module key to what to add */
	const additions = new Map();
	let fixable = true;

	/**
	 * @param {string} request module request as written
	 * @param {string | undefined} exportName named export, or undefined for the module
	 * @param {string} local local name
	 * @returns {void}
	 */
	const addImport = (request, exportName, local) => {
		const key = moduleKey(request);
		const addition = additions.get(key) || {
			moduleRequest: withExtension(request) || request,
			head: undefined,
			named: [],
		};

		if (exportName !== undefined) {
			addition.named.push(
				exportName === local ? local : `${exportName} as ${local}`,
			);
		} else if (addition.head === undefined) {
			addition.head = local;
		} else {
			// One tag takes one default binding
			fixable = false;
		}

		additions.set(key, addition);
	};

	for (const { typedefs: aliases } of plainComments) {
		for (const { moduleRequest, exportName, alias } of aliases) {
			const binding = bindingKey(moduleKey(moduleRequest), exportName);

			if (bindings.get(binding) !== alias) {
				addImport(moduleRequest, exportName, alias);
			}

			bind(binding, alias);
		}
	}

	/**
	 * Gets the local name a module or one of its exports is bound to, binding
	 * it under a name nothing else in the file uses when it is not yet.
	 * @param {string} request module request as written
	 * @param {string | undefined} exportName named export, or undefined for the module
	 * @returns {string | undefined} the local name, or undefined when none is safe
	 */
	const localFor = (request, exportName) => {
		const binding = bindingKey(moduleKey(request), exportName);
		const bound = bindings.get(binding);

		if (bound !== undefined) {
			return bound;
		}

		const moduleName = moduleNameOf(request, resolve(request));
		/** @type {string[]} */
		const candidates =
			exportName === undefined
				? [moduleName, `${moduleName}Module`]
				: [
						exportName,
						...(specialized.has(binding)
							? [`Generic${capitalize(exportName)}`]
							: []),
						/^[A-Z]/.test(exportName)
							? `${capitalize(moduleName)}${exportName}`
							: `${moduleName}${capitalize(exportName)}`,
					];
		const local = candidates.find((name) => !used.has(name));

		if (local === undefined) {
			return undefined;
		}

		bind(binding, local);
		addImport(request, exportName, local);

		return local;
	};

	/** @type {Edit[]} */
	const edits = [];
	/** @type {Set<Site>} sites no name is safe for, left as they are */
	const unfixed = new Set();

	for (const site of sites) {
		const key = moduleKey(site.request);
		/** @type {string | undefined} */
		let replacement;

		if (key === filename) {
			// The module naming itself: what it names is in scope already
			replacement =
				site.members.length > 0 ? site.members.join(".") : undefined;
		} else if (namespaces.has(key)) {
			replacement = [namespaces.get(key), ...site.members].join(".");
		} else {
			const local = localFor(site.request, site.members[0]);

			replacement =
				local === undefined
					? undefined
					: [local, ...site.members.slice(1)].join(".");
		}

		if (replacement === undefined) {
			unfixed.add(site);
		} else {
			edits.push({ range: [site.start, site.end], text: replacement });
		}
	}

	/**
	 * @param {Comment} comment a comment to drop
	 * @returns {Edit} the edit dropping it, with its line when it stands alone
	 */
	const wholeLineRemoval = (comment) => {
		let [start, end] = rangeOf(comment);
		const lineStart = text.lastIndexOf("\n", start - 1) + 1;
		const lineEnd = text.indexOf("\n", end);

		if (
			text.slice(lineStart, start).trim() === "" &&
			text.slice(end, lineEnd === -1 ? text.length : lineEnd).trim() === ""
		) {
			start = lineStart;
			end = lineEnd === -1 ? text.length : lineEnd + 1;

			// Dropping a line between two blank ones would leave two
			if (text.slice(start - 2, start) === "\n\n" && text[end] === "\n") {
				end++;
			}
		}

		return { range: [start, end], text: "" };
	};

	for (const { comment } of plainComments) {
		edits.push(wholeLineRemoval(comment));
	}

	const removed = new Set(plainComments.map(({ comment }) => comment));
	/** @type {{ comment: Comment, removal: Edit }[]} import comments left with nothing to import */
	const emptied = [];
	/** @type {Set<ImportTag>} tags rewritten here, which take no other edit */
	const rewritten = new Set();

	for (const { range, text: replacement } of retargets) {
		edits.push({ range, text: replacement });
	}

	for (const tag of new Set(stale.map((entry) => entry.tag))) {
		const gone = new Set(
			stale.filter((entry) => entry.tag === tag).map((entry) => entry.binding),
		);
		const kept = tag.named.filter((binding) => !gone.has(binding));
		const [first] = tag.named;
		const last = /** @type {ImportBinding} */ (tag.named.at(-1));

		rewritten.add(tag);

		for (const { binding, origin } of stale) {
			if (gone.has(binding)) {
				addImport(origin.moduleRequest, origin.exportName, binding.local);
			}
		}

		if (kept.length > 0) {
			edits.push({
				range: [first.start, last.end],
				text: kept.map((binding) => binding.text).join(", "),
			});
		} else if (tag.head !== undefined) {
			edits.push({
				range: [tag.head.end, text.indexOf("}", last.end) + 1],
				text: "",
			});
		} else if ((tag.comment.value.match(/@\w+/g) || []).length === 1) {
			const removal = wholeLineRemoval(tag.comment);

			edits.push(removal);
			emptied.push({ comment: tag.comment, removal });
			removed.add(tag.comment);
		} else {
			fixable = false;
		}
	}
	/** @type {string[]} */
	const newComments = [];

	for (const [key, addition] of additions) {
		const tag = importTags.find(
			(one) =>
				!one.namespace &&
				!removed.has(one.comment) &&
				!rewritten.has(one) &&
				moduleKey(one.moduleRequest) === key &&
				(addition.head === undefined ||
					(one.head === undefined && one.named.length > 0)),
		);

		if (tag === undefined) {
			const head = addition.head === undefined ? [] : [addition.head];
			const named =
				addition.named.length === 0 ? [] : [`{ ${addition.named.join(", ")} }`];

			newComments.push(
				`/** @import ${[...head, ...named].join(", ")} from ${JSON.stringify(addition.moduleRequest)} */`,
			);
			continue;
		}

		const last = tag.named.at(-1);

		if (addition.named.length > 0 && last !== undefined) {
			edits.push({
				range: [last.end, last.end],
				text: `, ${addition.named.join(", ")}`,
			});
		} else if (addition.named.length > 0 && tag.head !== undefined) {
			edits.push({
				range: [tag.head.end, tag.head.end],
				text: `, { ${addition.named.join(", ")} }`,
			});
		}

		if (addition.head !== undefined) {
			const brace = text.lastIndexOf("{", tag.named[0].start);

			edits.push({ range: [brace, brace], text: `${addition.head}, ` });
		}
	}

	if (newComments.length > 0) {
		const lines = newComments.join("\n");
		const statements = sourceCode.ast.body.map(rangeOf);
		const lastImport = importTags
			.map(({ comment }) => comment)
			.findLast(
				(comment) =>
					!removed.has(comment) &&
					statements.every(
						([start, end]) =>
							!(rangeOf(comment)[0] >= start && rangeOf(comment)[1] <= end),
					),
			);
		/** @type {number | undefined} */
		let headerEnd;

		for (const statement of sourceCode.ast.body) {
			if (!isHeaderStatement(statement)) {
				break;
			}

			[, headerEnd] = rangeOf(statement);
		}

		const start = text.startsWith("#!") ? text.indexOf("\n") + 1 : 0;
		const [first] = sourceCode.getAllComments();
		const license =
			first !== undefined &&
			!first.value.startsWith("*") &&
			!/^\s*eslint/.test(first.value) &&
			text.slice(start, rangeOf(first)[0]).trim() === ""
				? first
				: undefined;

		if (lastImport !== undefined) {
			const [, at] = rangeOf(lastImport);

			edits.push({ range: [at, at], text: `\n${lines}` });
		} else if (emptied.length > 0) {
			// The new tags take the place of the one they replace
			const [{ comment, removal }] = emptied;

			removal.range = rangeOf(comment);
			removal.text = lines;
		} else if (headerEnd !== undefined) {
			edits.push({ range: [headerEnd, headerEnd], text: `\n\n${lines}` });
		} else if (license === undefined) {
			edits.push({ range: [start, start], text: `${lines}\n\n` });
		} else {
			const [, at] = rangeOf(license);

			edits.push({ range: [at, at], text: `\n\n${lines}` });
		}
	}

	/** @type {Rule.ReportFixer | null} */
	const fix = fixable
		? (fixer) =>
				edits.map(({ range, text: replacement }) =>
					fixer.replaceTextRange(range, replacement),
				)
		: null;

	for (const { comment, typedefs: aliases } of plainComments) {
		const [start, end] = rangeOf(comment);

		for (const { alias } of aliases) {
			context.report({
				loc: {
					start: sourceCode.getLocFromIndex(start),
					end: sourceCode.getLocFromIndex(end),
				},
				messageId: "preferImportTag",
				data: { alias },
				fix,
			});
		}
	}

	for (const { binding, origin, tag } of stale) {
		context.report({
			loc: {
				start: sourceCode.getLocFromIndex(binding.start),
				end: sourceCode.getLocFromIndex(binding.end),
			},
			messageId: "importedAlias",
			data: {
				name: binding.local,
				request: tag.moduleRequest,
				origin: origin.moduleRequest,
			},
			fix,
		});
	}

	for (const { range, origin } of retargets) {
		context.report({
			loc: {
				start: sourceCode.getLocFromIndex(range[0]),
				end: sourceCode.getLocFromIndex(range[1]),
			},
			messageId: "aliasedImport",
			data: { origin },
			fix,
		});
	}

	for (const site of sites) {
		context.report({
			loc: {
				start: sourceCode.getLocFromIndex(site.start),
				end: sourceCode.getLocFromIndex(site.end),
			},
			messageId: "inlineImport",
			data: { request: site.request },
			fix: unfixed.has(site) ? null : fix,
		});
	}
};

// #endregion

/**
 * @param {string} moduleRequest module the type comes from
 * @param {string | undefined} exportName named export, or undefined for the whole module
 * @param {string} alias local name the type is bound to
 * @returns {string} the equivalent `@import` comment
 */
const buildImportComment = (moduleRequest, exportName, alias) => {
	const binding =
		exportName === undefined
			? alias
			: `{ ${exportName === alias ? alias : `${exportName} as ${alias}`} }`;

	return `/** @import ${binding} from ${JSON.stringify(moduleRequest)} */`;
};

/**
 * @type {import("eslint").Rule.RuleModule} rule rule
 */
export const rule = {
	create(context) {
		const { sourceCode, filename } = context;
		const [{ extension = "ignore", inline = false, typedefs = true } = {}] =
			/** @type {[{ extension?: "always" | "ignore", inline?: boolean, typedefs?: boolean }?]} */ (
				context.options
			);
		// Without a real file name there is no directory to resolve against
		const directory =
			extension === "always" && path.isAbsolute(filename)
				? path.dirname(filename)
				: undefined;

		/**
		 * @param {string} request module request as written
		 * @returns {string | undefined} the request with its extension, when it lacks one
		 */
		const withExtension = (request) =>
			directory === undefined || !RELATIVE_REQUEST.test(request)
				? undefined
				: resolveWithExtension(directory, request);

		return {
			"Program:exit"() {
				for (const tag of collectImportTags(sourceCode)) {
					const request = tag.moduleRequest;
					const fixed = withExtension(request);

					if (fixed === undefined) {
						continue;
					}

					// `end` sits just past the closing quote of the request
					const requestStart = tag.end - 1 - request.length;

					context.report({
						loc: {
							start: sourceCode.getLocFromIndex(requestStart),
							end: sourceCode.getLocFromIndex(tag.end - 1),
						},
						messageId: "missingExtension",
						data: { request, fixed },
						fix: (fixer) =>
							fixer.replaceTextRange([requestStart, tag.end - 1], fixed),
					});
				}

				if (inline) {
					reportInlineImports(context, typedefs, withExtension);
					return;
				}

				if (!typedefs) return;

				for (const comment of sourceCode.getAllComments()) {
					if (comment.type !== "Block" || !comment.value.startsWith("*")) {
						continue;
					}

					const commentRange = /** @type {[number, number]} */ (comment.range);
					const body = stripLineMarkers(comment.value);

					PLAIN_IMPORT_TYPEDEF.lastIndex = 0;

					let match;

					while ((match = PLAIN_IMPORT_TYPEDEF.exec(body)) !== null) {
						const [text, , moduleRequest, exportName, alias] = match;
						const start = commentRange[0] + 2 + match.index;
						// Only a comment holding this tag and nothing else can be swapped
						// in place; lifting one tag out of a block is left to the author
						const isWholeComment =
							!comment.value.includes("\n") && body.trim() === text.trim();

						context.report({
							loc: {
								start: sourceCode.getLocFromIndex(start),
								end: sourceCode.getLocFromIndex(start + text.length),
							},
							messageId: "preferImportTag",
							data: { alias },
							fix: isWholeComment
								? (fixer) =>
										fixer.replaceTextRange(
											commentRange,
											buildImportComment(
												withExtension(moduleRequest) || moduleRequest,
												exportName,
												alias,
											),
										)
								: null,
						});
					}
				}
			},
		};
	},
	meta: {
		docs: {
			description:
				"Require `@import` rather than a `@typedef` that only aliases an `import()`",
			recommended: false,
		},
		fixable: "code",
		messages: {
			preferImportTag:
				"`{{alias}}` aliases an `import()`; declare it with `@import` instead of `@typedef`.",
			missingExtension: 'Write "{{request}}" with its extension: "{{fixed}}".',
			aliasedImport:
				'This module only imports the type it names; point the typedef at "{{origin}}".',
			importedAlias:
				'"{{request}}" imports `{{name}}` without exporting it; import it from "{{origin}}".',
			inlineImport:
				'Import the type from "{{request}}" with `@import` instead of an inline `import()`.',
		},
		schema: [
			{
				type: "object",
				properties: {
					extension: {
						description:
							"`always` requires a relative `@import` path to name its file with the extension",
						enum: ["always", "ignore"],
					},
					inline: {
						description:
							"`true` reports every `import()` in a JSDoc type, not only a `@typedef` that aliases one",
						type: "boolean",
					},
					typedefs: {
						description:
							"`false` leaves `@typedef` tags alone, for a module whose typedefs are its exports",
						type: "boolean",
					},
				},
				additionalProperties: false,
			},
		],
		type: "suggestion",
	},
};
