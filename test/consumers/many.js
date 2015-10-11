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
    var parser = many(single('a'));

    var parseResult = parser(stream);

    assert(parseResult.accepted);
    assert(parseResult.valid);

    assert.deepequal(
      parseResult.value.map(function(el) {
        return el.value;
      }),
      ['a', 'a', 'a']
    );
  });

  it('accepts zero b\'s in aaabbbccc', function() {
    var stream = linestream('test', 'aaabbbccc');
    var parser = many(single('b'));

    var parseResult = parser(stream);

    assert(parseResult.accepted);
    assert(parseResult.valid);

    // many never rejects, it just finds zero matches
    assert.deepequal(parseResult.value, []);
  });
});
