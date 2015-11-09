'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var any = require('../../lib/consumers/any.js');
var digit = require('../../lib/consumers/digit.js');
var if_ = require('../../lib/consumers/if.js');
var labelledOr = require('../../lib/consumers/labelledOr.js');
var many = require('../../lib/consumers/many.js');
var Stream = require('../../lib/streams/stream.js');

describe('labelledOr', function() {
  it('labels results', function() {
    var stream = Stream('0x$');

    var consumer = many(labelledOr(
      ['digit', digit],
      ['alpha', if_(function(x) { return ('a' <= x && x <= 'z'); })],
      ['other', any]
    ));

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, true);

    assert.deepEqual(parseResult.value, [
      {label: 'digit', value: 0},
      {label: 'alpha', value: 'x'},
      {label: 'other', value: '$'}
    ]);
  });
});
