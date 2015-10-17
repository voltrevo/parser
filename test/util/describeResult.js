'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var describeResult = require('../../lib/util/describeResult.js');

var mockParseResult = function(accepted, valid) {
  return {
    name: 'foo',
    accepted: accepted,
    valid: valid,
    invalidations: [],
    location: ['a', 'b']
  };
};

var mockStream = {
  describeMarkRange: function(markA, markB) { return [markA, markB].join('-'); }
};

describe('describeResult', function() {
  it('produces appropriate heading when invalidations are empty', function() {
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

  it('includes invalidation reasons', function() {
    var parseResult = mockParseResult(true, false);

    parseResult.invalidations.push({
      reason: 'because the test said so'
    });

    parseResult.invalidations.push({
      reason: 'because the test said so again'
    });

    assert.equal(
      describeResult(parseResult, mockStream),
      (
        'foo invalid at a-b:\n' +
        '  because the test said so\n' +
        '  because the test said so again'
      )
    );
  });

  it('includes description of reference of invalidation', function() {
    var parseResult = mockParseResult(false, false);

    parseResult.invalidations.push({
      reason: 'because the test said so',
      ref: mockParseResult(false, false)
    });

    assert.equal(
      describeResult(parseResult, mockStream),
      (
        'foo rejected at a-b:\n' +
        '  because the test said so:\n' +
        '    foo rejected at a-b'
      )
    );
  });
});
