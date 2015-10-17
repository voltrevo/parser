'use strict';

var parser = require('../lib/index.js');
var Stream = require('../lib/streams/stream.js');
var jsonParser = require('./json.js');
var tinyCpp = require('./tinyCpp/cppParse.js');

window.json = function(str) {
  return jsonParser(Stream(str));
};

window.cpp = function(str) {
  return parser.mustConsumeAll(tinyCpp)(Stream(str));
};

window.json.impl = jsonParser.impl;
window.stream = Stream;
