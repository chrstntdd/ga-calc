// @ts-check
const path = require("path"),
  webpack = require("webpack"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  TerserPlugin = require("terser-webpack-plugin"),
  { CleanWebpackPlugin } = require("clean-webpack-plugin"),
  Stylish = require("webpack-stylish"),
  OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"),
  ExtractCssChunks = require("extract-css-chunks-webpack-plugin"),
  // ENV VARIABLES
  IS_PRODUCTION = process.env.NODE_ENV === "production",
  IS_DEVELOPMENT = process.env.NODE_ENV === "development",
  // PATHS
  publicPath = "/",
  entryPoint = path.resolve(__dirname, "src/client/browser"),
  outputPath = path.resolve(__dirname, "dist")

module.exports = {
  context: __dirname,

  mode: IS_PRODUCTION ? "production" : IS_DEVELOPMENT && "development",

  bail: IS_PRODUCTION,

  devtool: IS_PRODUCTION ? false : "cheap-module-source-map",

  entry: [entryPoint].filter(Boolean),

  output: {
    path: IS_PRODUCTION ? outputPath : undefined,
    pathinfo: IS_DEVELOPMENT,
    filename: "js/[name].[hash:8].js",
    chunkFilename: "js/[name].[chunkhash:8].chunk.js",
    publicPath,
    devtoolModuleFilenameTemplate: "[absolute-resource-path]",
    devtoolFallbackModuleFilenameTemplate: "[absolute-resource-path]?[hash]"
  },

  optimization: {
    minimize: IS_PRODUCTION,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: { ecma: 8 },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2
          },
          mangle: { safari10: true },
          output: {
            ecma: 8,
            comments: false,
            ascii_only: true
          }
        },
        parallel: true,
        cache: true,
        sourceMap: true
      }),

      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false,
            annotation: true
          }
        }
      })
    ],
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        default: false,
        vendors: false,
        framework: {
          chunks: "all",
          name: "preact",
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](preact)[\\/]/,
          priority: 40,
          enforce: true
        },

        vendor: {
          name: "vendor",
          test: /[\\/]node_modules[\\/]/,
          minChunks: 1,
          priority: 30
        },
        commons: {
          name: "commons",
          minChunks: 3,
          priority: 20
        }
      },
      maxInitialRequests: 25,
      minSize: 20000
    },
    runtimeChunk: true
  },

  resolve: {
    modules: ["node_modules"],
    extensions: [".ts", ".tsx", ".mjs", ".js", ".json", ".jsx"]
  },

  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },

      {
        oneOf: [
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: [
              { loader: require.resolve("babel-loader") },
              {
                loader: "linaria/loader",
                options: {
                  sourceMap: IS_DEVELOPMENT
                }
              }
            ]
          },

          {
            type: "javascript/auto",
            test: /\.mjs$/,
            use: []
          },

          {
            test: /\.css$/,
            use: [
              IS_PRODUCTION
                ? ExtractCssChunks.loader
                : require.resolve("style-loader"),
              require.resolve("css-loader")
            ]
          }
        ]
      }
    ]
  },

  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: IS_DEVELOPMENT,
          template: path.resolve(__dirname, "src/client/index.html"),
          minify: false
        }
      )
    ),

    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      __DEV__: IS_DEVELOPMENT
    }),

    IS_PRODUCTION &&
      new ExtractCssChunks({
        filename: IS_PRODUCTION ? "./css/main.[contenthash:8].css" : "[id].css"
      }),

    new CleanWebpackPlugin(),

    new Stylish(),

    IS_DEVELOPMENT && new webpack.HotModuleReplacementPlugin()
  ].filter(Boolean),

  watch: IS_DEVELOPMENT,
  performance: false,
  stats: "minimal",

  devServer: {
    compress: true,
    clientLogLevel: "none",
    contentBase: entryPoint,
    watchContentBase: true,
    host: "0.0.0.0",
    publicPath,
    quiet: true,
    overlay: false,
    hot: true,
    historyApiFallback: {
      disableDotRule: true
    }
  }
}
