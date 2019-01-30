const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    contentScript: "./src/content_script.js",
    backgroundScript: "./src/background_script.js",
    panel: "./src/panel.js",
    panelApp: "./src/panel-app.js"
  },
  plugins: [new CleanWebpackPlugin(["build"])],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build")
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
