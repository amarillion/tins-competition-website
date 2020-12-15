module.exports = {
	parser: "babel-eslint",
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 10
	},
	env: {
		"browser": true,
	},
	extends: "eslint:recommended",
	rules: {
		'indent': [ 'error', 'tab', { 'ignoredNodes': ['TemplateLiteral'] } ],
		"semi": [2, "always"],
		"no-console": [0]
	},
	globals: {
		"Phaser": true,
		"DocumentTouch": true
	}
};