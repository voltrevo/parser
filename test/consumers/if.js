'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var any = require('../../lib/consumers/any.js');
var if_ = require('../../lib/consumers/if.js');
var many = require('../../lib/consumers/many.js');
var Stream = require('../../lib/streams/stream.js');

var getStreamContent = function(stream) {
  return many(any).consume(stream).value;
};

describe('digit', function() {
  it('accepts elements that satisfy condition', function() {
    var stream = Stream('0123456789');

    var consumer = many(if_(function(x) { return x !== '6'; }));

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, true);
    assert.deepEqual(parseResult.value, '012345'.split(''));
    assert.deepEqual(getStreamContent(stream), '6789'.split(''));
  });
});
