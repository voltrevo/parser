'use strict';

/* global describe it */

var assert = require('assert');

var commentFilter = require('../../lib/streams/commentFilter.js');
var describeStream = require('../describers/Stream.js');
var LineStream = require('../../lib/streams/lineStream.js');

describe('commentFilter', function() {
  it('filters out line comments', function() {
    var stream = commentFilter(
      LineStream('test', [
        '// this should be ignored',
        'a// more ignored // stuff',
        'b'
      ].join('\n'))
    );

    assert.equal(stream.next(), '\n');
    assert.equal(stream.next(), 'a');
    assert.equal(stream.next(), '\n');
    assert.equal(stream.next(), 'b');
  });

  it('filters out block comments', function() {
    var stream = commentFilter(
      LineStream('test', [
        '/* this should be ignored */',
        'a/* more ignored *//* stuff */',
        'b'
      ].join('\n'))
    );

    assert.equal(stream.next(), '\n');
    assert.equal(stream.next(), 'a');
    assert.equal(stream.next(), '\n');
    assert.equal(stream.next(), 'b');
  });

  it('filters out nested block comments', function() {
    var stream = commentFilter(
      LineStream('test', [
        '/* this should be ignored',
        '  code = here;',
        '  ',
        '  /* this inner block comment shouldn\'t interfere with the outer block comment */',
        '  more.code = here',
        '*/',
        'b'
      ].join('\n'))
    );

    assert.equal(stream.next(), '\n');
    assert.equal(stream.next(), 'b');
  });

  it('hasNext when starting on a comment and there is a newline', function() {
    var stream = commentFilter(
      LineStream('test', '// foobar\n')
    );

    assert.equal(stream.hasNext(), true);
  });

  it('single \'/\' has a next', function() {
    var stream = commentFilter(
      LineStream('test', '/')
    );

    assert.equal(stream.hasNext(), true);
  });

  it('\'/ \' has a next', function() {
    var stream = commentFilter(
      LineStream('test', '/ ')
    );

    assert.equal(stream.hasNext(), true);
  });

  it('\'//\' doesn\'t have a next', function() {
    var stream = commentFilter(
      LineStream('test', '//')
    );

    assert.equal(stream.hasNext(), false);
  });

  it('\'foo\' has a next', function() {
    var stream = commentFilter(
      LineStream('test', 'foo')
    );

    assert.equal(stream.hasNext(), true);
  });

  it('next is \'/\' when the \'/\' isn\'t followed by another \'/\'', function() {
    var stream = commentFilter(
      LineStream('test', '/ ')
    );

    assert.equal(stream.next(), '/');
  });

  it('next on \'//\' throws', function() {
    var stream = commentFilter(
      LineStream('test', '//')
    );

    var caughtException = undefined;

    try {
      stream.next();
    } catch (e) {
      caughtException = e;
    }

    assert.equal(!!caughtException, true);
  });

  describeStream(function(data) {
    return commentFilter(LineStream('test', data));
  });
});
