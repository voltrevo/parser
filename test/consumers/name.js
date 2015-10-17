'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var name = require('../../lib/consumers/name.js');
var single = require('../../lib/consumers/single.js');

describe('name', function() {
  it('creates a consumer with the provided name', function() {
    var consumer = name('the-x', single('x'));

    assert.equal(consumer.name, 'the-x');
  });
});
