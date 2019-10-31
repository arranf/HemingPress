const path = require("path");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const AssetsPlugin = require("assets-webpack-plugin");

module.exports = (env, argv) => {
  return {
    watchOptions: {
      ignored: ["/node_modules/"]
    },
    entry: {
      main: path.join(__dirname, "src", "index.js")
    },
    output: {
      filename: "[name].[contenthash].js",
      chunkFilename: "[id].[contenthash].js",
      path: path.resolve(__dirname, "static"),
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.css?$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.styl(us)?$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            {
              loader: 'stylus-loader',
              options: {
                preferPathResolver: 'webpack'
              }
            }
          ]
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        {
          test: /\.(svg)$/,
          use: [
            {
              loader: 'svg-url-loader',
              options: {
                noquotes: true,
              },
            },
          ],
        },
        { test: /\.vue$/, use: 'vue-loader' },
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      // Move CSS from JS into it's own CSS bundle
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
        chunkFilename: "[id].[contenthash].css"
      }),
      // Outputs file in a JSON format readable by Hugo
      new AssetsPlugin({
        filename: "webpack.json",
        path: path.join(__dirname, "data"),
        prettyPrint: true,
        includeAllFileTypes: false,
        fileTypes: ['js', 'css']
      }),
      new CopyWebpackPlugin(
        [
          {
            from: "./src/svg/",
            to: "./svg"
          },
          {
            from: "./src/sw.js",
            to: "sw.js"
          }
        ]
      )
    ]
  };
};
