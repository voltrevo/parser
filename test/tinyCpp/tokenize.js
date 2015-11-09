'use strict';

var testTemplate = require('./testTemplate.js');
var tokenize = require('../../examples/tinyCpp/cppParse/tokenize.js');

testTemplate(tokenize, {
  valid: [
    [''],
    ['+ -'],
    ['x + y * z'],
    ['x+y*z'],
    ['x(1)'],
    ['x(1, 2)']
  ],
  invalid: [
    ' ' // TODO: undecided whether this should actually fail
  ]
});
