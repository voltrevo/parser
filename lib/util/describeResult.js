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

var Heading = function(parseResult) {
  return (
    parseResult.name +
    ' ' +
    ResultType(parseResult) +
    ' at ' +
    parseResult.stream.describeMarkRange.apply(undefined, parseResult.location)
  );
};

var describeInvalidation = undefined;

var describeResult = function(parseResult) {
  var heading = Heading(parseResult);

  if (parseResult.invalidations.length === 0) {
    return heading;
  }

  return heading + ':\n' + indent(
    parseResult.invalidations.map(function(invalidation) {
      return describeInvalidation(invalidation);
    }).join('\n')
  );
};

describeInvalidation = function(invalidation) {
  var result = invalidation.reason;

  if (invalidation.ref) {
    result += ':\n' + indent(
      describeResult(invalidation.ref)
    );
  }

  return result;
};

module.exports = describeResult;
