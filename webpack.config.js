// @ts-check
const path = require("path"),
  webpack = require("webpack"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  TerserPlugin = require("terser-webpack-plugin"),
  { CleanWebpackPlugin } = require("clean-webpack-plugin"),
  Stylish = require("webpack-stylish"),
  OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"),
  // MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  WorkerPlugin = require("worker-plugin"),
  ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin"),
  // errorOverlayMiddleware = require("react-dev-utils/errorOverlayMiddleware"),
  // evalSourceMapMiddleware = require("react-dev-utils/evalSourceMapMiddleware"),
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
            ecma: 5,
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
          name: "react",
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription|object-assign)[\\/]/,
          priority: 40,
          enforce: true
        },

        vendor: {
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
    modules: ["node_modules", path.resolve(__dirname, "../../node_modules")],
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
            use: {
              loader: require.resolve("babel-loader")
            }
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
          },

          {
            loader: require.resolve("file-loader"),
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: "static/media/[name].[hash:8].[ext]"
            }
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
          inject: false,
          template: path.resolve(__dirname, "src/client/index.html"),
          minify: false
        }
      )
    ),

    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      __DEV__: IS_DEVELOPMENT
    }),

    new WorkerPlugin(),

    IS_PRODUCTION &&
      new ExtractCssChunks({
        filename: IS_PRODUCTION ? "./css/main.[contenthash:8].css" : "[id].css",
        chunkFilename: IS_PRODUCTION
          ? "./css/[id].[contenthash:8].css"
          : "[id].css"
      }),

    new CleanWebpackPlugin(),

    new Stylish(),

    IS_DEVELOPMENT && new webpack.HotModuleReplacementPlugin(),

    IS_DEVELOPMENT && new ReactRefreshWebpackPlugin()
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
