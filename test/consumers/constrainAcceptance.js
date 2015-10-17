'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var LineStream = require('../../lib/streams/lineStream.js');
var constrainAcceptance = require('../../lib/consumers/constrainAcceptance.js');
var many = require('../../lib/consumers/many.js');
var or = require('../../lib/consumers/or.js');
var sequence = require('../../lib/consumers/sequence.js');
var single = require('../../lib/consumers/single.js');
var transform = require('../../lib/consumers/transform.js');

describe('constrainAcceptance', function() {
  it('can make many(a) reject on exactly 3 a\'s', function() {
    var stream = LineStream('test', 'a;aa;aaa;aaaa;aaaaa;');

    var testConsumer = constrainAcceptance(
      many(single('a')),
      function(value) {
        return value.length !== 3;
      }
    );

    var consumer = many(
      sequence(
        or(
          transform(
            testConsumer,
            function(value) {
              return { // TODO: Implement /annotation/ for this use-case.
                label: 'testConsumer',
                value: value
              };
            }
          ),
          transform(
            many(single('a')),
            function(value) {
              return {
                label: 'testConsumer rejected',
                value: value
              };
            }
          )
        ),
        single(';')
      )
    );

    var parseResult = consumer.consume(stream);

    assert.deepEqual(
      parseResult.value.map(function(sequenceElement) {
        return sequenceElement[0];
      }),
      [
        { label: 'testConsumer', value: ['a'] },
        { label: 'testConsumer', value: ['a', 'a'] },
        { label: 'testConsumer rejected', value: ['a', 'a', 'a'] },
        { label: 'testConsumer', value: ['a', 'a', 'a', 'a'] },
        { label: 'testConsumer', value: ['a', 'a', 'a', 'a', 'a'] }
      ]
    );
  });
});
