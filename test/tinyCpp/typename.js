'use strict';

var testTemplate = require('./testTemplate.js');
var typename = require('../../examples/tinyCpp/cppParse/typename.js');

testTemplate(typename, {
  valid: [
    ['int', 'int']
  ],
  invalid: [
    ' int',
    ''
  ]
});
