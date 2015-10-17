'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var whitespace = require('../../lib/consumers/whitespace.js');
var many = require('../../lib/consumers/many.js');
var Stream = require('../../lib/streams/stream.js');

describe('whitespace', function() {
  it('accepts whitespace', function() {
    var stream = Stream(' \n\t  \fabcdef');

    var consumer = many(whitespace);

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, true);
    assert.deepEqual(parseResult.value, ' \n\t  \f'.split(''));
  });
});
