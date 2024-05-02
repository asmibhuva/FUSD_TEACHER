const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'production',
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      {
        test: /\.(scss)$/,
        use: [{
          // inject CSS to page
          loader: 'style-loader'
        }, {
          // translates CSS into CommonJS modules
          loader: 'css-loader'
        }, {
          // compiles Sass to CSS
          loader: 'sass-loader'
        }]
      },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      {
        oneOf: [
          {
            test: [/\.avif$/],
            loader: require.resolve('url-loader'),
            options: {
              mimetype: 'image/avif',
              filename: 'static/media/[name].[ext]',
            },
          },
          {
            test: [/\.bmp$/, /\.gif$/, /\.svg$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              filename: 'static/media/[name].[ext]',
            },
          },
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            loader: require.resolve('babel-loader'),
            options: {
              filename: 'static/js/[name].[ext]',
            },
          },
          {
            test: /\.(js|mjs)$/,
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            loader: require.resolve('babel-loader'),

          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              filename: 'static/media/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
}