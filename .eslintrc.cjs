module.exports = {
	parserOptions: {
		"parser": "@typescript-eslint/parser"
	},
	env: {
		"browser": true,
		"es6": true,
	},
	extends: [
		"eslint:recommended",
		"plugin:vue/vue3-essential"
	],
	rules: {
		'indent': [ 'error', 'tab', { 'ignoredNodes': ['TemplateLiteral'] } ],
		"semi": [2, "always"],
		"no-console": [0],
	},
};