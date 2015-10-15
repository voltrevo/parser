'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var once = require('../../lib/util/once.js');

describe('once', function() {
  describe('memoize', function() {
    it('only calls the wrapped function once', function() {
      var calls = 0;

      var fn = once.memoize(function() { calls++; });

      fn();
      fn();
      fn();

      assert.equal(calls, 1);
    });

    it('stores and returns the result of the first call', function() {
      var token = {};

      var fn = once.memoize(function() { return token; });

      [0, 1, 2].map(fn).forEach(function(result) {
        assert.equal(result, token);
      });
    });

    it('passes the supplied arguments', function() {
      var arg0 = {};
      var arg1 = {};
      var arg2 = {};

      var args = undefined;

      once.memoize(function() {
        args = Array.prototype.slice.apply(arguments);
      })(arg0, arg1, arg2);

      assert.equal(args[0], arg0);
      assert.equal(args[1], arg1);
      assert.equal(args[2], arg2);
    });
  });

  describe('assert', function() {
    it('calls the wrapped function on the first call', function() {
      var calls = 0;
      var token = {};

      var fn = once.assert(function() {
        calls++;
        return token;
      });

      var result = fn();

      assert.equal(result, token);
      assert.equal(calls, 1);
    });

    it('throws after the first call', function() {
      var fn = once.assert(function() {});

      fn();

      var caughtException = undefined;

      try {
        fn();
      } catch (e) {
        caughtException = e;
      }

      assert.equal(!!caughtException, true);
    });

    it('passes the supplied arguments', function() {
      var arg0 = {};
      var arg1 = {};
      var arg2 = {};

      var args = undefined;

      once.assert(function() {
        args = Array.prototype.slice.apply(arguments);
      })(arg0, arg1, arg2);

      assert.equal(args[0], arg0);
      assert.equal(args[1], arg1);
      assert.equal(args[2], arg2);
    });
  });
});
