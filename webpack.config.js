const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    contentScript: "./src/content_script.js",
    backgroundScript: "./src/background_script.js",
    panel: "./src/panel.js",
    panelApp: "./src/panel-app.js",
    installDevtools: "./src/install-devtools.js",
    forceMountUnmount: "./src/inspected-window-helpers/force-mount-unmount.js",
    overlayHelpers: "./src/inspected-window-helpers/overlay-helpers.js",
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, "src/panel.html") },
        { from: path.resolve(__dirname, "src/main.html") },
      ],
    }),
  ],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
