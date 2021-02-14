const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')

const publicPath = '/antares-trade'

module.exports = {
  mode: 'development',
  entry: './src/index.tsx', // Point to main file
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    publicPath: `${publicPath}/`
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader', // compiles Sass to CSS, using Node Sass by default
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
        ],
      },
      {
        test: /\.(js|jsx|tsx|ts)$/, // All ts and tsx files will be process by
        use: ['babel-loader', 'ts-loader'], // first babel-loader, then ts-loader
        exclude: /node_modules/, // ignore node_modules
      },
    ],
  },
  devServer: {
    historyApiFallback: {
      index: publicPath,
    },
    publicPath
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body',
    }),
    new CleanWebpackPlugin({
      verbose: true,
    }),
  ],
}
