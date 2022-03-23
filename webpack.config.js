const path = require('path');

module.exports = {
  entry: {
    gameModeMenu: './src/menu/gameMenu.ts',
    game: './src/game/index.ts',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
