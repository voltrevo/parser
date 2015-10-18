'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var makeValueFullResult = require('../../lib/consumers/makeValueFullResult.js');
var single = require('../../lib/consumers/single.js');
var Stream = require('../../lib/streams/stream.js');

describe('makeValueFullResult', function() {
  it('makes value full result', function() {
    var stream = Stream('x');

    var consumer = makeValueFullResult(single('x'));

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.value.name, '"x"');
    assert.equal(parseResult.value.value, 'x');
    assert.equal(parseResult.value.accepted, true);
    assert.equal(parseResult.value.valid, true);
    assert.equal(parseResult.value.invalidations.length, 0);
    assert.equal(parseResult.value.location.length, 2);
  });
});
