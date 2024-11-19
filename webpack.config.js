const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.feature'],
  },
  module: {
    rules: [
      {
        test: /\.feature$/,
        use: 'raw-loader', // This loader processes .feature files
      },
      // Add other loaders if needed
    ],
  },
};
