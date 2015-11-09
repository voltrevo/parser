'use strict';

var testTemplate = require('./testTemplate.js');
var integer = require('../../examples/tinyCpp/cppParse/integer.js');

testTemplate(integer, {
  valid: [
    ['0', 0],
    ['-0', -0],
    ['123', 123],
    ['-123', -123]
  ],
  invalid: [
    '',
    ' 0',
    '0 ',
    ' ',
    'x',
    'NaN'
  ]
});
