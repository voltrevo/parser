'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var defer = require('../../lib/util/defer.js');

describe('defer', function() {
  it('does not create the deferred function when not called', function() {
    var called = false;

    defer(function() {
      called = true;
      return function() {}; // The deferred function
    });

    assert.equal(called, false);
  });

  it('creates the deferred function only once', function() {
    var calls = 0;

    var deferFn = defer(function() {
      calls++;
      return function() {}; // The deferred function
    });

    deferFn();
    deferFn();
    deferFn();

    assert.equal(calls, 1);
  });

  it('calls the deferred function with supplied args and forwards return value', function() {
    var calls = [];
    var token = {};

    var deferFn = defer(function() {
      return function() {
        var args = Array.prototype.slice.apply(arguments);
        calls.push(args);

        return token;
      };
    });

    var result = deferFn('a', 'b', 'c');

    assert.equal(result, token);
    assert.deepEqual(calls, [['a', 'b', 'c']]);
  });
});
