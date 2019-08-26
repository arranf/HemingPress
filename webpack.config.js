const path = require("path");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");


module.exports = (env, argv) => {
  return {
    watchOptions: {
      ignored: ["/node_modules/"]
    },
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: "all",
      }
    },
    output: {
      filename: "[name].bundle.js",
      chunkFilename: "[name].bundle.js",
      path: path.resolve(__dirname, "static")
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
          exclude: /node_modules/,
          loader: "babel-loader"
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
        sourceMap: true,
        cache: true,
        parallel: true,
        uglifyOptions: {
          warning: false,
          compress: true
        },
        exclude: '/js/sidebar.js'
      }),
      new MiniCssExtractPlugin({
        filename: "[name].bundle.css",
        chunkFilename: "[id].bundle.css"
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
