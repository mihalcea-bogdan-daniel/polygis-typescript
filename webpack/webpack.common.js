const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");

module.exports = {
	entry: {
		popup: path.join(srcDir, "popup.tsx"),
		options: path.join(srcDir, "options.tsx"),
		background: path.join(srcDir, "background.ts"),
		content_script: path.join(srcDir, "content_script.tsx"),
		mutation: path.join(srcDir, "mutation.tsx"),
	},
	output: {
		path: path.join(__dirname, "../dist/js"),
		filename: "[name].js",
	},
	optimization: {
		splitChunks: {
			name: "vendor",
			chunks(chunk) {
				return chunk.name !== "background";
			},
		},
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					// Creates `style` nodes from JS strings
					"style-loader",
					// Translates CSS into CommonJS
					"css-loader",
					// Compiles Sass to CSS
					"sass-loader",
				],
			},
			{
				test: /\.css$/i,
				use: [
					// Translates CSS into CommonJS
					"css-loader",
					// Compiles Sass to CSS
				],
			},
		],
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
		modules: [__dirname, "node_modules"],
	},
	plugins: [
		new CopyPlugin({
			patterns: [{ from: ".", to: "../", context: "public" }],
			options: {},
		}),
	],
};
