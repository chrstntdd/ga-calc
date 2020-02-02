const IS_PRODUCTION = process.env.NODE_ENV === "production"
const IS_DEV = process.env.NODE_ENV === "development"

const sharedConfig = {
  env: {
    modern: {
      presets: [
        [
          require.resolve("@babel/preset-env"),
          {
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
  presets: [require.resolve("@babel/preset-typescript")],
  plugins: [
    IS_DEV && require("./goober-display-name-plugin"),
    IS_DEV && require.resolve("react-refresh/babel"),
    "preval",
    [
      "module-resolver",
      {
        root: ["./src"]
      }
    ],
    [require.resolve("@babel/plugin-syntax-dynamic-import")],
    [
      require.resolve("@babel/plugin-proposal-class-properties"),
      { loose: true }
    ],
    [require.resolve("@babel/plugin-transform-react-jsx")],
    !IS_PRODUCTION && [
      require.resolve("@babel/plugin-transform-react-jsx-source")
    ]

    // ["module:fast-async", { spec: true }]
  ].filter(Boolean)
}

const mainBabelConfig = {
  sourceMaps: true,
  ...sharedConfig
}

module.exports = mainBabelConfig
