'use strict';

module.exports = function(str) {
  var lines = str.split('\n');
  var extraNewline = lines[lines.length - 1] === '';

  if (extraNewline) {
    lines.pop();
  }

  var indentedLines = lines.map(function(line) {
    return '  ' + line;
  });

  if (extraNewline) {
    indentedLines.push('');
  }

  return indentedLines.join('\n');
};
