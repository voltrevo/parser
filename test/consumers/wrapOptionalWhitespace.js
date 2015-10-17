'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var digit = require('../../lib/consumers/digit.js');
var many = require('../../lib/consumers/many.js');
var Stream = require('../../lib/streams/stream.js');
var wrapOptionalWhitespace = require('../../lib/consumers/wrapOptionalWhitespace.js');

describe('wrapOptionalWhitespace', function() {
  it('allows consumers to accept the whitespace surrounding them', function() {
    var stream = Stream('12 3 45   67 8 9');

    var consumer = many(
      wrapOptionalWhitespace(digit)
    );

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, true);
    assert.deepEqual(parseResult.value, '123456789'.split(''));
  });
});
