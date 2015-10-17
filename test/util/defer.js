'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var defer = require('../../lib/util/defer.js');
var digit = require('../../lib/consumers/digit.js');
var Stream = require('../../lib/streams/stream.js');

var fakeConsumer = {
  name: 'fake',
  consume: function() { return {}; }
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
    'calls the deferred consumer.consume with supplied stream and forwards return value',
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

      var result = deferred.consume('(fake stream)');

      assert.equal(result, token);
      assert.deepEqual(calls, [['(fake stream)']]);
    }
  );

  it('overrides the name (in order to provide it without creating the consumer)', function() {
    var stream = Stream('0');

    var consumer = defer('overriddenName', function() {
      return digit;
    });

    assert.equal(consumer.name, 'overriddenName');

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.name, 'overriddenName');
  });
});
