'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var invalid = require('../../lib/consumers/invalid.js');
var name = require('../../lib/consumers/name.js');
var single = require('../../lib/consumers/single.js');
var Stream = require('../../lib/streams/stream.js');

describe('name', function() {
  it('creates a consumer with the provided name', function() {
    var consumer = name('the-x', single('x'));

    assert.equal(consumer.name, 'the-x');
  });

  it('invalidation refs have the outermost name', function() {
    var stream = Stream('x');

    var consumer = invalid(
      name('outer', name('inner', single('x')))
    );

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.invalidations[0].ref.name, 'outer');
  });
});
