'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var LineStream = require('../../lib/streams/lineStream.js');
var constrainValidity = require('../../lib/consumers/constrainValidity.js');
var single = require('../../lib/consumers/single.js');

describe('constrainValidity', function() {
  it('can make the single(a) in abc invalid', function() {
    var stream = LineStream('test', 'abc');

    var consumer = constrainValidity(
      single('a'),
      function() { return false; }
    );

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, false);
    assert.equal(parseResult.value, 'a');
  });
});
