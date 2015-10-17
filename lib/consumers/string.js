'use strict';

var single = require('./single.js');
var sequence = require('./sequence.js');
var transform = require('./transform.js');

module.exports = function(str) {
  return transform(
    sequence.apply(undefined, str.split('').map(single)),
    function(chars) {
      return chars.join('');
    }
  );
};
