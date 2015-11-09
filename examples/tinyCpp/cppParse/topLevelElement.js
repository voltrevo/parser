'use strict';

var parser = require('../../../lib/index.js').flat;

var function_ = require('./function.js');
var functionForwardDeclaration = require('./functionForwardDeclaration.js');
var globalVariableDeclaration = require('./globalVariableDeclaration.js');

module.exports = parser.name('topLevelElement', parser.labelledOr(
  ['function', function_],
  ['functionForwardDeclaration', functionForwardDeclaration],
  ['globalVariableDeclaration', globalVariableDeclaration]
));
