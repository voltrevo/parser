'use strict';

// local modules
var any = require('../consumers/any.js');
var constrainAcceptance = require('../consumers/constrainAcceptance.js');
var constrainValidity = require('../consumers/constrainValidity.js');
var consumerFilter = require('./consumerFilter.js');
var defer = require('../util/defer.js');
var many = require('../consumers/many.js');
var optional = require('../consumers/optional.js');
var or = require('../consumers/or.js');
var sequence = require('../consumers/sequence.js');
var single = require('../consumers/single.js');
var string = require('../consumers/string.js');
var transform = require('../consumers/transform.js');

var lineCommentAndNewline = transform(
  sequence(
    string('//'),
    many(
      constrainAcceptance(any, function(value) { return value !== '\n'; })
    ),
    constrainValidity(
      optional(single('\n')),
      function(value) {
        return value.set;
      }
    )
  ),
  function() {
    return '\n';
  }
);

var blockCommentAndNext = undefined;

var nextChar = or(
  lineCommentAndNewline,
  defer('blockCommentAndNext', function() { return blockCommentAndNext; }),
  any
);

var blockComment = sequence(
  string('/*'),
  many(or(
    defer('blockComment', function() { return blockComment; }),
    constrainAcceptance(any, function(value) { return value !== '*'; }),
    sequence(
      single('*'),
      constrainAcceptance(any, function(value) { return value !== '/'; })
    )
  )),
  string('*/')
);

blockCommentAndNext = transform(
  sequence(
    blockComment,
    nextChar
  ),
  function(value) {
    return value[1];
  }
);

module.exports = function(inputStream) {
  return consumerFilter(nextChar, inputStream);
};
