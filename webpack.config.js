const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "./src/index.js"),
  devServer: {
    port: 3000,
    open: true
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./index.html"
    })
  ]
};
