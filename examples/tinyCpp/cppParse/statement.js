'use strict';

var parser = require('../../../lib/index.js').flat;

var variableDeclaration = require('./variableDeclaration.js');
var returnStatement = require('./returnStatement.js');
var expressionStatement = require('./expressionStatement.js');

var codeBlock = parser.defer('codeBlock', function() {
  return require('./codeBlock.js');
});

var if_ = parser.defer('cppIf', function() {
  return require('./if.js');
});

var while_ = parser.defer('while', function() {
  return require('./while.js');
});

module.exports = parser.name('statement', parser.labelledOr(
  ['variableDeclaration', variableDeclaration],
  ['return', returnStatement],
  ['expression', expressionStatement],
  ['controlStructure', parser.labelledOr(
    ['codeBlock', codeBlock],
    ['if', if_],
    ['while', while_]
  )]
));
