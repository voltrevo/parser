'use strict';

// local modules
var andNot = require('./andNot.js');
var any = require('./any.js');
var Consumer = require('./consumer.js');
var defer = require('../util/defer.js');
var invalid = require('./invalid.js');
var labelledSequence = require('./labelledSequence.js');
var makeValueFullResult = require('./makeValueFullResult.js');
var many = require('./many.js');
var or = require('./or.js');

module.exports = function(beginConsumer, endConsumer) {
  var blockName = 'block(' + beginConsumer.name + ', ' + endConsumer.name + ')';

  var block = labelledSequence(
    ['begin', beginConsumer],
    ['content', makeValueFullResult(many(or(
      defer(blockName, function() { return block; }),
      invalid(beginConsumer),
      andNot(any, endConsumer)
    )))],
    ['end', endConsumer]
  );

  return Consumer(blockName, function(api) {
    var res = block.consume(api.stream);

    return api.forward(
      (
        res.accepted ?
        api.stream.substream.apply(undefined, res.value.content.location) :
        undefined
      ),
      res
    );
  });
};
