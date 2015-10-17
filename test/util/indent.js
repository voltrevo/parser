'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var indent = require('../../lib/util/indent.js');

describe('indent', function() {
  it('does nothing to an empty string', function() {
    assert.equal(indent(''), '');
  });

  it('indents \'x\'', function() {
    assert.equal(indent('x'), '  x');
  });

  it('preserves newline at end', function() {
    assert.equal(indent('a\n b\nc\n'), '  a\n   b\n  c\n');
  });

  it('does not insert newline at end if original string didn\'t have one', function() {
    assert.equal(indent('a\n b\nc\n'), '  a\n   b\n  c\n');
  });
});
