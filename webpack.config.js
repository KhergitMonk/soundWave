const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = (env) => {

  if (!env) env = {};

  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.html$/,
          use: 
            {
              loader: "html-loader"
            }
        },
        {
          test: /\.(jpg|png|gif|svg|pdf|ico)$/,
          use: [
              {
                  loader: 'file-loader',
                  options: {
                      name: '[path][name]-[hash:8].[ext]'
                  },
              },
          ]
        }
      ]
    },
    devServer: {
      historyApiFallback: true,
      contentBase: './',
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
      }
    },
    plugins: [
      new webpack.DefinePlugin({ 'process.env.NODE_SERVER_URL': JSON.stringify(env.NODE_SERVER_URL) }),
      new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html"
      }),
    ]
  }
};