'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var linestream = require('../../lib/streams/linestream.js');
var many = require('../../lib/consumers/many.js');
var single = require('../../lib/consumers/single.js');

describe('many', function() {
  it('accepts three a\'s in aaabbbccc', function() {
    var stream = linestream('test', 'aaabbbccc');
    var consumer = many(single('a'));

    var parseResult = consumer(stream);

    assert(parseResult.accepted);
    assert(parseResult.valid);

    assert.deepEqual(
      parseResult.value.map(function(el) {
        return el.value;
      }),
      ['a', 'a', 'a']
    );
  });

  it('accepts zero b\'s in aaabbbccc', function() {
    var stream = linestream('test', 'aaabbbccc');
    var consumer = many(single('b'));

    var parseResult = consumer(stream);

    assert(parseResult.accepted);
    assert(parseResult.valid);

    // many never rejects, it just finds zero matches
    assert.deepEqual(parseResult.value, []);
  });
});
