'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var any = require('../../lib/consumers/any.js');
var digit = require('../../lib/consumers/digit.js');
var many = require('../../lib/consumers/many.js');
var Stream = require('../../lib/streams/stream.js');
var substream = require('../../lib/consumers/substream.js');

// TODO: really need to make this a shared utility
var getStreamContent = function(stream) {
  return many(any).consume(stream).value;
};

describe('substream', function() {
  it('produces a substream from the wrapped consumer', function() {
    var stream = Stream('0123456789abcdef');

    var consumer = substream(many(digit));

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, true);
    assert.deepEqual(getStreamContent(parseResult.value), '0123456789'.split(''));
  });

  it('is invalid when the wrapped consumer is invalid', function() {
    var stream = Stream('x');

    var consumer = substream(digit);

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, false);
    assert.equal(parseResult.valid, false);
    assert.equal(parseResult.value, undefined);
  });
});
