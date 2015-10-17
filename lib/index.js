'use strict';

var flatten = require('flatten-object-strict');

var tree = {
  consumers: {
    any: require('./consumers/any.js'),
    constrainAcceptance: require('./consumers/constrainAcceptance.js'),
    constrainValidity: require('./consumers/constrainValidity.js'),
    digit: require('./consumers/digit.js'),
    invalid: require('./consumers/invalid.js'),
    list: require('./consumers/list.js'),
    many: require('./consumers/many.js'),
    name: require('./consumers/name.js'),
    namedSequence: require('./consumers/namedSequence.js'),
    nameValueTransform: require('./consumers/nameValueTransform.js'),
    oneOrMore: require('./consumers/oneOrMore.js'),
    optional: require('./consumers/optional.js'),
    or: require('./consumers/or.js'),
    sequence: require('./consumers/sequence.js'),
    single: require('./consumers/single.js'),
    string: require('./consumers/string.js'),
    transform: require('./consumers/transform.js'),
    whitespace: require('./consumers/whitespace.js'),
    wrapOptionalWhitespace: require('./consumers/wrapOptionalWhitespace.js')
  },
  streams: {
    commentFilter: require('./streams/commentFilter.js'),
    LineStream: require('./streams/lineStream.js'),
    Stream: require('./streams/stream.js')
  },
  util: {
    defer: require('./util/defer.js')
  }
};

module.exports = {
  tree: tree,
  flat: flatten(tree)
};
