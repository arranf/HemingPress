const path= require("path");
// const fs= require("fs");
// const toml= require("toml");

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin= require("mini-css-extract-plugin");
const UglifyJsPlugin= require("uglifyjs-webpack-plugin");
const WorkboxPlugin= require("workbox-webpack-plugin");
const CopyWebpackPlugin= require("copy-webpack-plugin");
const CleanWebpackPlugin= require("clean-webpack-plugin");

// const OfflinePlugin= require("offline-plugin");
// const ManifestPlugin= require("webpack-manifest-plugin");
// const CompressionPlugin= require("compression-webpack-plugin");
// const WebpackPwaManifest= require("webpack-pwa-manifest");

const mode = process.env.NODE_ENV || 'development';
const isDevMode = mode !== "production";
// const configFile = toml.parse(fs.readFileSync("./config.toml", "utf-8"));
// const manifest = configFile.manifest;
const cleaning = isDevMode ? ["static/*.*"] : ["public/*.*", "static/*.*"];

module.exports = (env, argv) => {
  console.log(mode)
  return {
    mode: mode,
    watchOptions: {
      ignored: ["/node_modules/"]
    },
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: "all",
      }
    },
    entry: {
      main: "./src/index.js",
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
              loader:'stylus-loader',
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
        }
      }),
      new MiniCssExtractPlugin({
        filename: "[name].bundle.css" ,
        chunkFilename: "[id].bundle.css"
      }),
      new WorkboxPlugin.InjectManifest({
        swSrc: "./src/sw.js",
        swDest: "sw.js"
      }),
    //   new ManifestPlugin({
    //     fileName: "../data/manifest.json",
    // //   }),
    //   new CompressionPlugin(),
      new CopyWebpackPlugin([{
        from: "./src/svg/",
        to: "./svg"
      }]),
    //   new WebpackPwaManifest({
    //     filename: "manifest.json",
    //     orientation: "portrait",
    //     display: "standalone",
    //     start_url: ".",
    //     inject: true,
    //     fingerprints: true,
    //     ios: true,
    //     publicPath: null,
    //     includeDirectory: true,
    //     theme_color: manifest.theme_color,
    //     name: manifest.name,
    //     short_name: manifest.short_name,
    //     description: manifest.description,
    //     background_color: manifest.background_color,
    //     icons: [{
    //       src: path.resolve(manifest.iconsSrc),
    //       sizes: [96, 128, 192, 256, 384, 512],
    //     },
    //     {
    //       src: path.resolve(manifest.iconsSrc),
    //       sizes: "1024x1024"
    //     }]
    //   }),
      new CleanWebpackPlugin(cleaning, {watch: true, beforeEmit: true})
    ]
  };
};
