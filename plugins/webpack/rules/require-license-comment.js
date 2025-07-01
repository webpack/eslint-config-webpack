/**
 * @type {import("eslint").Rule} rule
 */
export const rule = {
	create(context) {
		const sourceCode = context.getSourceCode();

		return {
			"Program:exit"(program) {
				const comments = sourceCode.getAllComments();
				const licenseComment = comments.find(
					(comment) =>
						comment.type === "Block" &&
						/\n\s*MIT License http:\/\/www\.opensource\.org\/licenses\/mit-license\.php\n\s*(?:(Authors? .+)\n)?\s*/g.test(
							comment.value,
						),
				);

				if (!licenseComment) {
					context.report({
						loc: program.loc,
						message: "Expected license comment.",
					});

					return;
				}

				const afterComment = sourceCode.text[licenseComment.end];

				if (afterComment !== "\n") {
					context.report({
						loc: licenseComment.loc,
						message: "Expected newline after license comment.",
					});

					return;
				}

				const afterAfterComment = sourceCode.text[licenseComment.end + 1];

				if (afterAfterComment !== "\n") {
					context.report({
						loc: licenseComment.loc,
						message: "Expected newline after license comment.",
					});
				}
			},
		};
	},
	meta: {
		docs: {
			category: "Best Practices",
			description: "Require license comment",
			recommended: true,
		},
		fixable: "code",
		type: "layout",
	},
};
