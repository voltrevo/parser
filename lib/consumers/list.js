'use strict';

var many = require('./many.js');
var optional = require('./optional.js');
var sequence = require('./sequence.js');
var transform = require('./transform.js');

var second = function(x) { return x[1]; };

module.exports = function(item, delimiter) {
  return transform(
    optional(sequence(
      // head
      item,

      // tail
      many(sequence(
        delimiter,
        item
      ))
    )),
    function(optionalResult) {
      if (!optionalResult.set) {
        return [];
      }

      var head = optionalResult.value[0];
      var tail = optionalResult.value[1];

      return [head].concat(tail.map(second));
    }
  );
};
