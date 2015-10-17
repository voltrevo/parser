'use strict';

// TODO: block comments and implement via parser

module.exports = function(inputStream) {
  var stream = {};

  stream.hasNext = function() {
    if (!inputStream.hasNext()) {
      return false;
    }

    var c = inputStream.peek();

    if (c !== '/') {
      return true;
    }

    var mark = inputStream.mark();

    // Skip over the '/' we just peeked
    inputStream.next();

    // If that's the end of the stream the '/' is not part of a comment and is the next element.
    if (!inputStream.hasNext()) {
      inputStream.restore(mark);
      return true;
    }

    var cc = inputStream.next();

    if (cc !== '/') {
      inputStream.restore(mark);
      return true;
    }

    while (true) {
      if (!inputStream.hasNext()) {
        inputStream.restore(mark);
        return false;
      }

      if (inputStream.next() === '\n') {
        inputStream.restore(mark);
        return true;
      }
    }
  };

  stream.next = function() {
    var c = inputStream.next();

    if (c === '/') {
      var cc = inputStream.peek();

      if (cc !== '/') {
        return c;
      }

      // Move over the '/' we just peeked
      inputStream.next();

      while (true) {
        var ccc = inputStream.next();

        if (ccc === '\n') {
          return ccc;
        }
      }
    }

    return c;
  };

  [
    'mark',
    'restore',
    'describeMark',
    'describeMarkRange'
  ].forEach(function(method) {
    stream[method] = inputStream[method];
  });

  stream.peek = function() {
    var mark = stream.mark();
    var result = stream.next();
    stream.restore(mark);

    return result;
  };

  return stream;
};
