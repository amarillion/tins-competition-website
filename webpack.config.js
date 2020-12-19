const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require("webpack");
const resolve = dir => path.join(__dirname, dir);

const config = {
	// where webpack starts to build the bundle. All other deps are imported from here.
	entry: "./src/main.js",

	// how and where outputs and assets should be put.
	output: {
		filename: '[name].[hash].js',
		path: resolve("static"),

		// this will be the path prefix used by HtmlWebpackPlugin.
		// see: https://stackoverflow.com/questions/34620628/htmlwebpackplugin-injects-relative-path-files-which-breaks-when-loading-non-root
		publicPath: './static/' 
		
	},

	module: {
		rules: [{
			/* `import y from 'x.svg'` -> copy x.svg to the output folder and assign the name of the file to y. */
			test: /\.svg$/,
			use: [{ 
				loader: 'file-loader',
				options: {
					outputPath: 'assets'
				}
			}]
		}]
	},

	// customize the webpack build process.
	plugins: [
		new HtmlWebpackPlugin({
			hash: true,
			template: "./src/index.html",
			filename: "index.html", //relative to root of the application
		}),
		new CopyWebpackPlugin({ patterns: [
			{ from: "assets", to: "" },
		]}),
	],

	devServer: {
		/** following two lines allow (less-secure) access from the Local network. */
		disableHostCheck: true,
		host: "0.0.0.0",
		/** any non-found static file falls back to index.html  */
		historyApiFallback: {
			rewrites: [
				{ from: /./, to: '/static/index.html' }
			]
		},
	}
};

module.exports = (env, argv) => {
	if (argv.mode === 'development') {
		// note that by default, development mode uses evil eval.
		// we must set the devtool explicitly to change this.
		config.devtool = 'inline-source-map';
	}
	if (argv.mode === 'production') {
		// do not enable source-map
	}
	return config;
};
