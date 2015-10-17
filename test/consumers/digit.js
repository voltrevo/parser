'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var digit = require('../../lib/consumers/digit.js');
var many = require('../../lib/consumers/many.js');
var Stream = require('../../lib/streams/stream.js');

describe('digit', function() {
  it('accepts digits', function() {
    var stream = Stream('0123456789abcdef');

    var consumer = many(digit);

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, true);
    assert.deepEqual(parseResult.value, '0123456789'.split(''));
  });
});
