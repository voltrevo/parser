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
    labelledOr: require('./consumers/labelledOr.js'),
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
    substream: require('./consumers/substream.js'),
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
    defer: require('./util/defer.js'),
    describeResult: require('./util/describeResult.js')
  }
};

var flat = flatten(tree);

// any, digit, none, and whitespace need to be handled explicitly because they are direct consumers
// which share .name and .consume.

tree.consumers.any = require('./consumers/any.js');
tree.consumers.digit = require('./consumers/digit.js');
tree.consumers.none = require('./consumers/none.js');
tree.consumers.whitespace = require('./consumers/whitespace.js');

flat.any = tree.consumers.any;
flat.digit = tree.consumers.digit;
flat.none = tree.consumers.none;
flat.whitespace = tree.consumers.whitespace;

module.exports = {
  tree: tree,
  flat: flat
};
