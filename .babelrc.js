const sharedConfig = {
  env: {
    modern: {
      presets: [
        [
          require.resolve("@babel/preset-env"),
          {
            modules: false,
            loose: true,
            exclude: ["transform-regenerator", "transform-async-to-generator"],
            targets: [
              "last 2 Chrome versions",
              "last 2 Safari versions",
              "last 2 iOS versions",
              "last 2 Edge versions",
              "Firefox ESR"
            ]
          }
        ]
      ]
    },
    legacy: {
      presets: [
        [
          require.resolve("@babel/preset-env"),
          {
            loose: true,
            corejs: 3,
            shippedProposals: true,
            useBuiltIns: "usage",
            exclude: ["transform-regenerator", "transform-async-to-generator"],
            targets: {
              browsers: ["ie 11"]
            }
          }
        ]
      ]
    }
  },
  presets: [["@babel/preset-typescript", { jsxPragma: "h" }], "linaria/babel"],
  plugins: [
    "preval",
    [
      "@babel/plugin-transform-react-jsx",
      { pragma: "h", pragmaFrag: "Fragment" }
    ]
  ]
}

const mainBabelConfig = {
  sourceMaps: true,
  ...sharedConfig
}

module.exports = mainBabelConfig
