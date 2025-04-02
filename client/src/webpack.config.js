const path = require('path');

module.exports = {
  // Other Webpack configurations...

  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
      // Add other fallbacks here if necessary
    },
  },

  // More configurations...
};
