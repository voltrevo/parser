'use strict';

/* eslint-disable no-console */

var fs = require('fs');
var Stream = require('../../../lib/streams/stream.js');
var cpp = require('../cppParse');

console.log(JSON.stringify(
  cpp(Stream(
    fs.readFileSync('stuff.cpp').toString()
  )).value,
  null,
  4
));
