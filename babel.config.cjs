// only for the benefit of jest...

module.exports = {
	env: {
		test: {
			presets: [
				['@babel/preset-env', { targets: { node: 'current' } }],
			],
		},
	},
};
