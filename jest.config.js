const esModules = [
	'lit',
	'@lit',
	'@open-wc/'
].join('|');

export default {
	testEnvironment: "jsdom",
	transform: {
		'^.+\\.js$': 'babel-jest',
	},
	transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
};
