'use strict';

var testTemplate = require('./testTemplate.js');
var program = require('../../examples/tinyCpp/cppParse/program.js');

testTemplate(program, {
  valid: [
    ['', []],
    ['int x = 3; int foo(); int foo() {}', [
      {
        label: 'globalVariableDeclaration',
        value: {
          type: 'int',
          name: 'x',
          value: 3
        }
      },
      {
        label: 'functionForwardDeclaration',
        value: {
          returnType: 'int',
          name: 'foo',
          arguments: []
        }
      },
      {
        label: 'function',
        value: {
          heading: {
            returnType: 'int',
            name: 'foo',
            arguments: []
          },
          body: []
        }
      }
    ]],
    [' ']
  ]
});
