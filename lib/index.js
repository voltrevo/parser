'use strict';

var flatten = require('flatten-object-strict');

var tree = {
  consumers: {
    constrainAcceptance: require('./consumers/constrainAcceptance.js'),
    constrainSingle: require('./consumers/constrainSingle.js'),
    constrainValidity: require('./consumers/constrainValidity.js'),
    digit: require('./consumers/digit.js'),
    invalid: require('./consumers/invalid.js'),
    list: require('./consumers/list.js'),
    many: require('./consumers/many.js'),
    oneOrMore: require('./consumers/oneOrMore.js'),
    optional: require('./consumers/optional.js'),
    or: require('./consumers/or.js'),
    sequence: require('./consumers/sequence.js'),
    single: require('./consumers/single.js'),
    transform: require('./consumers/transform.js'),
    whitespace: require('./consumers/whitespace.js')
  },
  streams: {
    commentFilter: require('./streams/commentFilter.js'),
    LineStream: require('./streams/LineStream.js'),
    Stream: require('./streams/Stream.js')
  },
  util: {
    defer: require('./util/defer.js')
  }
};

module.exports = {
  tree: tree,
  flat: flatten(tree)
};
