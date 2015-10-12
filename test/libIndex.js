'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var parser = require('../lib/index.js');

describe('parser', function() {
  it('provides a flat api and a tree api', function() {
    assert.equal(typeof parser.flat, 'object');
    assert.equal(typeof parser.tree, 'object');
  });
});
