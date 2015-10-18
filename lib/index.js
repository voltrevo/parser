'use strict';

var flatten = require('flatten-object-strict');

var tree = {
  consumers: {
    andNot: require('./consumers/andNot.js'),
    block: require('./consumers/block.js'),
    constrainAcceptance: require('./consumers/constrainAcceptance.js'),
    constrainValidity: require('./consumers/constrainValidity.js'),
    if: require('./consumers/if.js'),
    invalid: require('./consumers/invalid.js'),
    labelledSequence: require('./consumers/labelledSequence.js'),
    list: require('./consumers/list.js'),
    makeValueFullResult: require('./consumers/makeValueFullResult.js'),
    many: require('./consumers/many.js'),
    mustConsumeAll: require('./consumers/mustConsumeAll.js'),
    name: require('./consumers/name.js'),
    oneOrMore: require('./consumers/oneOrMore.js'),
    optional: require('./consumers/optional.js'),
    or: require('./consumers/or.js'),
    pipe: require('./consumers/pipe.js'),
    sequence: require('./consumers/sequence.js'),
    single: require('./consumers/single.js'),
    string: require('./consumers/string.js'),
    transform: require('./consumers/transform.js'),
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

var flat = flatten(tree);

// any, digit, and whitespace need to be handled explicitly because they are direct consumers which
// share .name and .consume.

tree.consumers.any = require('./consumers/any.js');
tree.consumers.digit = require('./consumers/digit.js');
tree.consumers.whitespace = require('./consumers/whitespace.js');

flat.any = tree.consumers.any;
flat.digit = tree.consumers.digit;
flat.whitespace = tree.consumers.whitespace;

module.exports = {
  tree: tree,
  flat: flat
};
