'use strict';

var parser = require('../lib/index.js').flat;

var deferField = function(obj, field) {
  return parser.defer(field, function() {
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
  parser.labelledSequence(
    ['minusSign', parser.optional(
      parser.single('-')
    )],
    ['nonNegativeInteger', nonNegativeInteger]
  ),
  function(value) {
    if (value.minusSign.set) {
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
            parser.any
          ),
          function(value) {
            var specialIndex = '\\ntr'.indexOf(value[1]); // TODO: are there others?

            if (specialIndex !== -1) {
              return '\\\n\t\r'[specialIndex];
            }

            return value[1];
          }
        ),
        parser.constrainAcceptance(
          parser.any,
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
  parser.constrainAcceptance(
    parser.labelledSequence(
      ['minusSign',
        parser.optional(parser.single('-'))
      ],
      ['leadingDigits',
        parser.many(parser.digit)
      ],
      ['decimalPointAndDigits',
        parser.optional(
          parser.labelledSequence(
            ['decimalPoint', parser.single('.')],
            ['decimalDigits', parser.many(parser.digit)]
          )
        )
      ],
      ['exponent',
        parser.optional(
          parser.sequence(
            parser.single('e'),
            integer
          )
        )
      ]
    ),
    function(n) {
      return (
        n.leadingDigits.length > 0 ||
        (
          n.decimalPointAndDigits.set &&
          n.decimalPointAndDigits.value.decimalDigits.length > 0
        )
      );
    }
  ),
  function(value) {
    var numStr = '';

    if (value.minusSign.set) {
      numStr += '-';
    }

    numStr += value.leadingDigits.join('');

    if (value.decimalPointAndDigits.set) {
      numStr += '.';
      numStr += value.decimalPointAndDigits.value.decimalDigits.join('');
    }

    if (value.exponent.set) {
      numStr += 'e';
      numStr += value.exponent.value[1];
    }

    return Number(numStr);
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
  parser.labelledSequence(
    parser.single('['),
    parser.many(parser.whitespace),
    ['items',
      parser.list(
        json.value,
        parser.wrapOptionalWhitespace(
          parser.single(',')
        )
      )
    ],
    parser.many(parser.whitespace),
    parser.single(']')
  ),
  function(value) {
    return value.items;
  }
);

json.object = parser.transform(
  parser.sequence(
    parser.single('{'),
    parser.many(parser.whitespace),
    parser.list(
      parser.labelledSequence(
        ['key', json.string],
        ['separator', parser.wrapOptionalWhitespace(
          parser.single(':')
        )],
        ['value', json.value]
      ),
      parser.wrapOptionalWhitespace(
        parser.single(',')
      )
    ),
    parser.many(parser.whitespace),
    parser.single('}')
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
