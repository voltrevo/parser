'use strict';

// local modules
var indent = require('./indent.js');

var ResultType = function(parseResult) {
  return (
    parseResult.valid    ? 'valid'   :
    parseResult.accepted ? 'invalid' :
                           'rejected'
  );
};

var Heading = function(parseResult, stream) {
  return (
    parseResult.name +
    ' ' +
    ResultType(parseResult) +
    ' at ' +
    stream.describeMarkRange.apply(undefined, parseResult.location)
  );
};

var describeInvalidation = undefined;

var describeResult = function(parseResult, stream) {
  var heading = Heading(parseResult, stream);

  if (parseResult.invalidations.length === 0) {
    return heading;
  }

  return heading + ':\n' + indent(
    parseResult.invalidations.map(function(invalidation) {
      return describeInvalidation(invalidation, stream);
    }).join('\n')
  );
};

describeInvalidation = function(invalidation, stream) {
  var result = invalidation.reason;

  if (invalidation.ref) {
    result += ':\n' + indent(
      describeResult(invalidation.ref, stream)
    );
  }

  return result;
};

module.exports = describeResult;
