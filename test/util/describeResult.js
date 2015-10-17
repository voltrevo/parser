'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var describeResult = require('../../lib/util/describeResult.js');

var mockStream = {
  describeMarkRange: function(markA, markB) { return [markA, markB].join('-'); }
};

describe('describeResult', function() {
  it('produces appropriate heading when invalidations are empty', function() {
    var mockParseResult = function(accepted, valid) {
      return {
        name: 'foo',
        accepted: accepted,
        valid: valid,
        invalidations: [],
        location: ['a', 'b']
      };
    };

    assert.equal(
      describeResult(mockParseResult(true, true), mockStream),
      'foo valid at a-b'
    );

    assert.equal(
      describeResult(mockParseResult(true, false), mockStream),
      'foo invalid at a-b'
    );

    assert.equal(
      describeResult(mockParseResult(false, false), mockStream),
      'foo rejected at a-b'
    );
  });
});
