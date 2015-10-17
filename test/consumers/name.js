'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var name = require('../../lib/consumers/name.js');
var single = require('../../lib/consumers/single.js');
var Stream = require('../../lib/streams/stream.js');

describe('name', function() {
  it('generates result with name field', function() {
    var stream = Stream('x');

    var consumer = name('the-x', single('x'));

    var parseResult = consumer(stream);

    assert.equal(parseResult.name, 'the-x');
  });
});
