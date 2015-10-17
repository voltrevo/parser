'use strict';

var parser = require('../lib/index.js');
var LineStream = require('../lib/streams/lineStream.js');
var jsonParser = require('./json.js');
// var tinyCpp = require('./tinyCpp/cppParse.js');

window.json = jsonParser;

/* window.cpp = function(str) {
  return parser.mustConsumeAll(tinyCpp)(Stream(str));
}; */

window.json.impl = jsonParser.impl;
window.parser = parser;
window.LineStream = LineStream;
window.describeResult = require('../lib/util/describeResult.js');
