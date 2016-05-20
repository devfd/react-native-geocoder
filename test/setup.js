require('babel-core/register')({
  presets: ["react-native"]
});
require("babel-polyfill");

require('colors');

var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);

global.expect = chai.expect;
