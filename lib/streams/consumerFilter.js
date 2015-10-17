'use strict';

var consumerFilter = function(consumer, stream) {
  var filteredStream = {};

  filteredStream.hasNext = function() {
    var mark = stream.mark();
    var parseResult = consumer.consume(stream);
    stream.restore(mark);

    return parseResult.valid;
  };

  filteredStream.next = function() {
    var mark = stream.mark();
    var parseResult = consumer.consume(stream);

    if (!parseResult.valid) {
      stream.restore(mark);
      throw new Error('filteredStream consumer failed to consume the stream');
    }

    return parseResult.value;
  };

  var delegatedMethods = [
    'mark',
    'restore',
    'describeMark',
    'describeMarkRange'
  ];

  delegatedMethods.forEach(function(method) {
    filteredStream[method] = stream[method];
  });

  filteredStream.peek = function() {
    var mark = stream.mark();
    var result = stream.next();
    stream.restore(mark);

    return result;
  };

  filteredStream.substream = function(startMark, endMark) {
    return consumerFilter(consumer, stream.substream(startMark, endMark));
  };

  return filteredStream;
};

module.exports = consumerFilter;
