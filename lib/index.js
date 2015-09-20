'use strict';

var flatten = require('flatten-object-strict');

var tree = {
  consumers: {
    constrainSingle: require('./consumers/constrainSingle.js'),
    many: require('./consumers/many.js'),
    or: require('./consumers/or.js'),
    sequence: require('./consumers/sequence.js'),
    single: require('./consumers/single.js')
  },
  streams: {
    lineStream: require('./streams/lineStream.js'),
    stream: require('./streams/stream.js')
  },
  util: {
    defer: require('./util/defer.js')
  }
};

module.exports = {
  tree: tree,
  flat: flatten(tree)
};
