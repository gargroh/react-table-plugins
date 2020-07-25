module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
        loose: true,
      },
    ],
    "@babel/preset-react",
  ],
  env: {
    test: {
      presets: ["@babel/preset-env", "@babel/preset-react"],
      plugins: ["@babel/plugin-transform-runtime"],
    },
  },
};
