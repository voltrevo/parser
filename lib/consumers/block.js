'use strict';

// local modules
var andNot = require('./andNot.js');
var any = require('./any.js');
var defer = require('../util/defer.js');
var invalid = require('./invalid.js');
var many = require('./many.js');
var name = require('./name.js');
var or = require('./or.js');
var sequence = require('./sequence.js');
var substream = require('./substream.js');
var transform = require('./transform.js');

module.exports = function(beginConsumer, endConsumer) {
  var blockName = 'block(' + beginConsumer.name + ', ' + endConsumer.name + ')';

  var block = sequence(
    beginConsumer,
    substream(many(or(
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
