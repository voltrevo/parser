'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var defer = require('../../lib/util/defer.js');

var fakeConsumer = {
  name: 'fake',
  consume: function() {}
};

describe('defer', function() {
  it('does not create the deferred consumer when not used', function() {
    var called = false;

    defer('fake', function() {
      called = true;
      return fakeConsumer;
    });

    assert.equal(called, false);
  });

  it('creates the deferred consumer.consume only once', function() {
    var calls = 0;

    var deferred = defer('fake', function() {
      calls++;
      return fakeConsumer;
    });

    deferred.consume();
    deferred.consume();
    deferred.consume();

    assert.equal(calls, 1);
  });

  it(
    'calls the deferred consumer.consume with supplied args and forwards return value',
    function() {
      var calls = [];
      var token = {};

      var deferred = defer('foo', function() {
        return {
          name: 'foo',
          consume: function() {
            var args = Array.prototype.slice.apply(arguments);
            calls.push(args);

            return token;
          }
        };
      });

      var result = deferred.consume('a', 'b', 'c');

      assert.equal(result, token);
      assert.deepEqual(calls, [['a', 'b', 'c']]);
    }
  );
});
