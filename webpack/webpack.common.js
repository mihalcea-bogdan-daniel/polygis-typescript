const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");
const rootDir = path.join(__dirname, "..");

module.exports = () => {
	const isProduction = process.env.NODE_ENV === "production";
	const envFile = isProduction ? ".production.env" : ".development.env";
	const envPath = path.resolve(rootDir, envFile);
	const envVars = require("dotenv").config({ path: envPath }).parsed || {};
	console.log("====================================");
	console.log(`using : ${envPath} env file`);
	console.log(`running in : ${process.env.NODE_ENV} mode`);
	console.log("====================================");
	return {
		entry: {
			popup: path.join(srcDir, "popup.tsx"),
			options: path.join(srcDir, "options.tsx"),
			background: path.join(srcDir, "background.ts"),
			content_script: path.join(srcDir, "content_script.tsx"),
			app: path.join(srcDir, "app.tsx"),
			inject: path.join(srcDir, "inject/inject.ts"),
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
						// "sass-loader",
						"postcss-loader",
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
				patterns: [
					{ from: ".", to: "../", context: "public" },
					// {from: "../node_modules/primereact/resources/themes/arya-orange/theme.css", to:"../css", context: "public"}
					// { from: path.join(__dirname, "../dist/js/inject.js"), to: path.join(__dirname, "../public/inject/inject.js") }, // Add this line to copy the inject.js file
				],
				options: {},
			}),
			new webpack.DefinePlugin({
				"process.env": JSON.stringify(envVars),
			}),
		],
	};
};
