/**
Copyright (C) Snakeroom Contributors 2019

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const { resolve } = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const dist = resolve("dist");

module.exports = {
	entry: {
		event: ["./src/event/index.ts"],
		popup: ["./src/popup/index.ts"]
	},
	output: {
		path: dist,
		filename: "[name].js",
		chunkFilename: "[name].chunk.js"
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"]
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: "ts-loader"
			}
		]
	},
	plugins: [new CopyPlugin([{ from: "./src/assets/static" }])],
	devtool: "source-map"
};
