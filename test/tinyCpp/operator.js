'use strict';

var testTemplate = require('./testTemplate.js');
var operator = require('../../examples/tinyCpp/cppParse/operator.js');

testTemplate(operator, {
  valid: [
    ['+', '+'],
    ['-', '-'],
    ['*', '*'],
    ['/', '/'],
    ['=', '=']
  ],
  invalid: [
    '',
    ' +',
    '+ ',
    '+-'
  ]
});
