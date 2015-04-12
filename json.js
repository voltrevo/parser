"use strict"

var parser = require("./parser")

var defer = parser.defer

var nonNegativeInteger = parser.transform(
    parser.oneOrMore(parser.digit),
    function(value) {
        var result = 0

        value.forEach(function(digit) {
            result *= 10
            result += digit
        })

        return result
    }
)

var integer = parser.transform(
    parser.labelledSequence(
        ["minusSign", parser.optional(
            parser.char("-")
        )],
        ["nonNegativeInteger", nonNegativeInteger]
    ),
    function(value) {
        if (value.minusSign.success) {
            return -value.nonNegativeInteger
        }

        return value.nonNegativeInteger
    }
)

var json = {}

json.value = parser.or(
    defer(json, "array"),
    defer(json, "object"),
    defer(json, "string"),
    defer(json, "number"),
    defer(json, "bool"),
    defer(json, "null")
)

json.string = parser.transform(
    parser.sequence(
        parser.char("\""),
        parser.many(
            parser.constrain(
                parser.anyChar,
                function(c) { return c !== "\"" }
            )
        ),
        parser.char("\"")
    ),
    function(value) {
        return value[1].join("")
    }
)

json.number = parser.transform(
    parser.constrain(
        parser.labelledSequence(
            [
                "minusSign",
                parser.optional(parser.char("-"))
            ],
            [
                "leadingDigits",
                parser.optional(nonNegativeInteger)
            ],
            [
                "decimalPointAndDigits",
                parser.optional(
                    parser.labelledSequence(
                        ["decimalPoint", parser.char(".")],
                        ["decimalDigits", parser.many(parser.digit)]
                    )
                )
            ],
            [
                "exponent",
                parser.optional(
                    parser.sequence(
                        parser.char("e"),
                        integer
                    )
                )
            ]
        ),
        function(n) {
            return (
                n.leadingDigits.success ||
                (
                    n.decimalPointAndDigits.success &&
                    n.decimalPointAndDigits.value.decimalDigits.success
                )
            )
        }
    ),
    function(value) {
        var result = 0

        if (value.leadingDigits.success) {
            result += value.leadingDigits.value
        }

        if (value.decimalPointAndDigits.success) {
            var multiplier = 1
            value.decimalPointAndDigits.value.decimalDigits.forEach(function(digit) {
                multiplier *= 0.1
                result += digit * multiplier
            })
        }

        if (value.exponent.success) {
            result *= Math.pow(10, value.exponent.value[1])
        }

        if (value.minusSign.success) {
            result *= -1
        }

        return result
    }
)

json.bool = parser.transform(
    parser.or(
        parser.string("true"),
        parser.string("false")
    ),
    function(value) {
        return value === "true"
    }
)

json.null = parser.transform(
    parser.string("null"),
    function() { return null }
)

json.array = parser.transform(
    parser.sequence(
        parser.char("["),
        parser.optionalWhitespace,
        parser.list(
            json.value,
            parser.wrapOptionalWhitespace(
                parser.char(",")
            )
        ),
        parser.optionalWhitespace,
        parser.char("]")
    ),
    function(value) {
        return value[2]
    }
)

json.object = parser.transform(
    parser.sequence(
        parser.char("{"),
        parser.optionalWhitespace,
        parser.list(
            parser.labelledSequence(
                ["key", json.string],
                ["separator", parser.wrapOptionalWhitespace(
                    parser.char(":")
                )],
                ["value", json.value]
            ),
            parser.wrapOptionalWhitespace(
                parser.char(",")
            )
        ),
        parser.optionalWhitespace,
        parser.char("}")
    ),
    function(value) {
        var result = {}
        
        value[2].forEach(function(property) {
            result[property.key] = property.value
        })

        return result
    }
)

module.exports = json.value