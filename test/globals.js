require('babel-core/register')({
  presets: ["react-native"]
});
require("babel-polyfill");

require('colors');

process.on('unhandledRejection', function(reason, p) {
  throw new Error(reason);
});
