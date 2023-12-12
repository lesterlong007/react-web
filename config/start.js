"use strict";

process.env.NODE_ENV = "development";

process.on("unhandledRejection", (err) => {
  throw err;
});

const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const { merge } = require("webpack-merge");
const webpackConfig = require("./webpack.config");

const PORT = parseInt(process.env.PORT, 10) || 8000;
const HOST = process.env.HOST || "localhost";
const protocol = process.env.HTTPS === "true" ? "https" : "http";

const startConfig = {
  devtool: "inline-source-map",
  target: "web",
};

const compiler = webpack(merge(webpackConfig, startConfig));

const devServerOptions = {
  host: HOST,
  port: PORT,
  open: true,
  hot: true,
  https: process.env.HTTPS === "true",
  historyApiFallback: true,
  client: {
    overlay: {
      errors: true,
      warnings: true,
    },
    progress: true,
  },
  proxy: [
    {
      context: ["/api", "/insurance-policy"],
      target: "https://api-uat.pulse.wedopulse.com/dev/v1",
      secure: false,
      changeOrigin: true,
    },
  ],
};

const server = new WebpackDevServer(compiler, devServerOptions);

const runServer = async () => {
  console.log(`Starting sever on ${protocol}://${HOST}:${PORT}`);
  try {
    await server.start();
  } catch (err) {
    console.log(err);
  }
};

runServer();
