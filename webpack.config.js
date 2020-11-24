/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const generateDevHTMLWebpackAssets = require('./utils/utils');

const LPConfig = require('./config.json');
const nodeEnv = process.env.NODE_ENV;
const isProduction = nodeEnv === 'production';
const environment = process.env.CB_ENVIRONMENT;
const port = environment === 'desktop' ? 5000 : 5001;

const finalConfig = !isProduction
  ? generateDevHTMLWebpackAssets(LPConfig)
  : LPConfig;

const config = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              data: '@import "src/styles/abstracts/_variables.scss";',
              includePaths: [__dirname, 'src'],
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|jpg|png|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'public/index.html' }],
    }),
    new HtmlWebpackPlugin({
      appMountId: 'app',
      filename: 'index.html',
      template: path.resolve(__dirname, './public/index.html'),
      templateParameters: {
        environment,
        renderPlaceholders: JSON.stringify(isProduction),
      },
      ...finalConfig,
    }),
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin({}),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devServer: {
    port,
    contentBase: path.join(__dirname, 'dist'),
    hot: true,
    compress: true,
  },
};

module.exports = config;
