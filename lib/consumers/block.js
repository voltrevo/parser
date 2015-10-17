'use strict';

// local modules
var andNot = require('./andNot.js');
var any = require('./any.js');
var defer = require('../util/defer.js');
var invalid = require('./invalid.js');
var labelledSequence = require('./labelledSequence.js');
var many = require('./many.js');
var name = require('./name.js');
var or = require('./or.js');
var transform = require('./transform.js');

module.exports = function(beginConsumer, endConsumer) {
  var blockName = 'block(' + beginConsumer.name + ', ' + endConsumer.name + ')';

  var blockTag = {};

  var block = name(blockName, transform(
    labelledSequence(
      ['begin', beginConsumer],
      ['content', many(or(
        defer(blockName, function() { return block; }),
        invalid(beginConsumer),
        andNot(any, endConsumer)
      ))],
      ['end', endConsumer]
    ),
    function(value) {
      value.tag = blockTag;
      return value;
    }
  ));

  return transform(
    block,
    function(value) {
      var result = [];
      var traverse = undefined;

      var traverseBlock = function(b) {
        [b.begin, b.content, b.end].forEach(function(piece) {
          if (Array.isArray(piece)) {
            piece.forEach(traverse);
          } else {
            result.push(piece);
          }
        });
      };

      traverse = function(subvalue) {
        if (subvalue.tag && subvalue.tag === blockTag) {
          traverseBlock(subvalue);
        } else {
          result.push(subvalue);
        }
      };

      value.content.forEach(traverse);

      return result;
    }
  );
};
