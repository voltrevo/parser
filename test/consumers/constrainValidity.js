'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var linestream = require('../../lib/streams/linestream.js');
var constrainValidity = require('../../lib/consumers/constrainValidity.js');
var single = require('../../lib/consumers/single.js');

describe('constrainValidity', function() {
  it('can make the single(a) in abc invalid', function() {
    var stream = linestream('test', 'abc');

    var parser = constrainValidity(
      single('a'),
      function() { return false; }
    );

    var parseResult = parser(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, false);
    assert.equal(parseResult.value, 'a');
  });
});
