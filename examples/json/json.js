'use strict';

var parser = require('../../lib/index.js').flat;

var deferField = function(obj, field) {
  return parser.defer(function() {
    return obj[field];
  });
};

var nonNegativeInteger = parser.transform(
  parser.oneOrMore(parser.digit),
  function(value) {
    var result = 0;

    value.forEach(function(digit) {
      result *= 10;
      result += digit;
    });

    return result;
  }
);

var integer = parser.transform(
  parser.namedSequence(
    parser.name('minusSign', parser.optional(
      parser.char('-')
    )),
    parser.name('nonNegativeInteger', nonNegativeInteger)
  ),
  function(value) {
    if (value.minusSign.success) {
      return -value.nonNegativeInteger;
    }

    return value.nonNegativeInteger;
  }
);

var json = {};

json.value = parser.or(
  deferField(json, 'array'),
  deferField(json, 'object'),
  deferField(json, 'string'),
  deferField(json, 'number'),
  deferField(json, 'bool'),
  deferField(json, 'null')
);

json.string = parser.transform(
  parser.sequence(
    parser.single('"'),
    parser.many(
      parser.or(
        parser.transform(
          parser.sequence(
            parser.single('\\'),
            parser.anyChar
          ),
          function(value) {
            var specialIndex = '\\ntr'.indexOf(value[1]); // TODO: are there others?

            if (specialIndex !== -1) {
              return '\\\n\t\r'[specialIndex];
            }

            return value[1];
          }
        ),
        parser.constrain(
          parser.anyChar,
          function(c) { return c !== '"'; }
        )
      )
    ),
    parser.single('"')
  ),
  function(value) {
    return value[1].join('');
  }
);

json.number = parser.transform(
  parser.constrain(
    parser.labelledSequence(
      [
        'minusSign',
        parser.optional(parser.char('-'))
      ],
      [
        'leadingDigits',
        parser.many(parser.digit)
      ],
      [
        'decimalPointAndDigits',
        parser.optional(
          parser.labelledSequence(
            ['decimalPoint', parser.char('.')],
            ['decimalDigits', parser.many(parser.digit)]
          )
        )
      ],
      [
        'exponent',
        parser.optional(
          parser.sequence(
            parser.char('e'),
            integer
          )
        )
      ]
    ),
    function(n) {
      return (
        n.leadingDigits.length > 0 ||
        (
          n.decimalPointAndDigits.success &&
          n.decimalPointAndDigits.value.decimalDigits.length > 0
        )
      );
    }
  ),
  function(value) {
    var numStr = '';

    if (value.minusSign.success) {
      numStr += '-';
    }

    numStr += value.leadingDigits.join('');

    if (value.decimalPointAndDigits.success) {
      numStr += '.';
      numStr += value.decimalPointAndDigits.value.decimalDigits.join('');
    }

    if (value.exponent.success) {
      numStr += 'e';
      numStr += value.exponent.value[1];
    }

    return parseFloat(numStr);
  }
);

json.bool = parser.transform(
  parser.or(
    parser.string('true'),
    parser.string('false')
  ),
  function(value) {
    return value[0] === 't';
  }
);

json.null = parser.transform(
  parser.string('null'),
  function() { return null; }
);

json.array = parser.transform(
  parser.sequence(
    parser.char('['),
    parser.optionalWhitespace,
    parser.list(
      json.value,
      parser.wrapOptionalWhitespace(
        parser.char(',')
      )
    ),
    parser.optionalWhitespace,
    parser.char(']')
  ),
  function(value) {
    return value[2];
  }
);

json.object = parser.transform(
  parser.sequence(
    parser.char('{'),
    parser.optionalWhitespace,
    parser.list(
      parser.labelledSequence(
        ['key', json.string],
        ['separator', parser.wrapOptionalWhitespace(
          parser.char(':')
        )],
        ['value', json.value]
      ),
      parser.wrapOptionalWhitespace(
        parser.char(',')
      )
    ),
    parser.optionalWhitespace,
    parser.char('}')
  ),
  function(value) {
    var result = {};

    value[2].forEach(function(property) {
      result[property.key] = property.value;
    });

    return result;
  }
);

json.value.impl = json;

module.exports = json.value;
