'use strict';

var testTemplate = require('./testTemplate.js');

var functionForwardDeclaration = require(
  '../../examples/tinyCpp/cppParse/functionForwardDeclaration.js'
);

testTemplate(functionForwardDeclaration, {
  valid: [
    ['int foo();', {
      returnType: 'int',
      name: 'foo',
      arguments: []
    }]
  ],
  invalid: [
    'intfoo();'
  ]
});
