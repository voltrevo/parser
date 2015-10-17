'use strict';

var single = require('./single.js');
var sequence = require('./sequence.js');
var transform = require('./transform.js');
var name = require('./name.js');

module.exports = function(str) {
  return name(JSON.stringify(str), transform(
    sequence.apply(undefined, str.split('').map(single)),
    function(chars) {
      return chars.join('');
    }
  ));
};
