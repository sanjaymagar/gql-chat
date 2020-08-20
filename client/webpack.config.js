const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  output: {
    publicPath: 'http://localhost:8082/',
  },

  resolve: {
    extensions: ['.jsx', '.js', '.json'],
  },

  devServer: {
    port: 8082,
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'chat',
      filename: 'remoteEntry.js',
      remotes: {},
      exposes: {
        './Chat': './src/components/Chat',
      },
      shared: require('./package.json').dependencies,
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
    }),
  ],
};
