const path = require("path");

const AssetsPlugin = require("assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');

module.exports = (_env, _argv) => {
  return {
    watchOptions: {
      ignored: ["/node_modules/"],
    },
    entry: {
      main: path.join(__dirname, "src", "index.js"),
    },
    optimization: {
      minimizer: [
        new TerserJSPlugin({
          extractComments: false,
          terserOptions: {
            output: {
              comments: false,
            },
          },
        }),
        new OptimizeCSSAssetsPlugin({}),
      ],
    },
    output: {
      filename: "[name].[contenthash].js",
      chunkFilename: "[id].[contenthash].js",
      path: path.resolve(__dirname, "static"),
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.css?$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
        {
          test: /\.js$/,
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
        {
          test: /\.(svg)$/,
          use: [
            {
              loader: "svg-url-loader",
              options: {
                noquotes: true,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      // Move CSS from JS into it's own CSS bundle
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
        chunkFilename: "[id].[contenthash].css",
      }),
      // Outputs file in a JSON format readable by Hugo
      new AssetsPlugin({
        filename: "webpack.json",
        path: path.join(__dirname, "data"),
        prettyPrint: true,
        includeAllFileTypes: false,
        fileTypes: ["js", "css"],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "./src/svg/",
            to: "./svg",
          },
        ],
      }),
    ],
  };
};
