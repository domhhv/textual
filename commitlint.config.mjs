const configuration = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"type-case": [2, "always", "lower-case"],
		"scope-case": [2, "always", "lower-case"],
		"subject-case": [2, "always", ["lower-case", "pascal-case", "camel-case"]],
	},
};

export default configuration;
