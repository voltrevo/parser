'use strict';

// core modules
var assert = require('assert');

// local modules
var andNot = require('./andNot.js');
var any = require('./any.js');
var defer = require('../util/defer.js');
var invalid = require('./invalid.js');
var many = require('./many.js');
var name = require('./name.js');
var none = require('./none.js');
var or = require('./or.js');
var sequence = require('./sequence.js');
var substream = require('./substream.js');
var transform = require('./transform.js');

module.exports = function(arg1, arg2, arg3) {
  var beginConsumer = undefined;
  var skipper = none;
  var endConsumer = undefined;

  var blockName = undefined;

  if (arguments.length === 2) {
    beginConsumer = arg1;
    endConsumer = arg2;
    blockName = 'block(' + beginConsumer.name + ', ' + endConsumer.name + ')';
  } else {
    assert(arguments.length === 3);
    beginConsumer = arg1;
    skipper = arg2;
    endConsumer = arg3;
    blockName = 'block(' + beginConsumer.name + ', ' + skipper.name + ', ' + endConsumer.name + ')';
  }

  var block = sequence(
    beginConsumer,
    substream(many(or(
      skipper,
      defer(blockName, function() { return block; }),
      invalid(beginConsumer),
      andNot(any, endConsumer)
    ))),
    endConsumer
  );

  return name(blockName, transform(
    block,
    function(value) {
      return value[1];
    }
  ));
};
