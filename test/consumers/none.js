'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var none = require('../../lib/consumers/none.js');
var Stream = require('../../lib/streams/stream.js');

describe('none', function() {
  it('rejects', function() {
    var stream = Stream('0123456789abcdef');

    var consumer = none;

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, false);
    assert.equal(parseResult.valid, false);
  });
});
