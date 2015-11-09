'use strict';

var testTemplate = require('./testTemplate.js');
var identifier = require('../../examples/tinyCpp/cppParse/identifier.js');

testTemplate(identifier, {
  valid: [
    ['_', '_'],
    ['foo', 'foo'],
    ['bar', 'bar'],
    ['_x', '_x'],
    ['_0', '_0'],
    ['foo0123bar', 'foo0123bar'],
    ['x_', 'x_'],
    ['_x_', '_x_'],
    ['_x_0', '_x_0']
  ],
  invalid: [
    '0',
    '7foo',
    'foo$bar',
    '',
    ' ',
    ' foo',
    'foo '
  ]
});
