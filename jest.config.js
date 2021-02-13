const esModules = [
	'lit-element',
	'lit-html',
	'@open-wc/'
].join('|');

export default {
	transform: {
		'^.+\\.js$': 'babel-jest',
	},
	transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
	setupFiles: ["jest-canvas-mock"]
};
