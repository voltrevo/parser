'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var sequence = require('../../lib/consumers/sequence.js');
var string = require('../../lib/consumers/string.js');
var Stream = require('../../lib/streams/stream.js');

describe('digit', function() {
  it('accepts strings', function() {
    var stream = Stream('abcdef');

    var consumer = sequence(
      string('abc'),
      string('def')
    );

    var parseResult = consumer(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, true);
    assert.deepEqual(parseResult.value, ['abc', 'def']);
  });
});
