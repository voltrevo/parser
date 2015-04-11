"use strict"

var parser = require("./parser")

var generators = parser.generators
var consumers = parser.consumers
var defer = parser.defer

var nonNegativeInteger = generators.transform(
    generators.oneOrMore(consumers.digit),
    function(value) {
        var result = 0

        value.forEach(function(digit) {
            result *= 10
            result += digit
        })

        return result
    }
)

var integer = generators.transform(
    generators.labelledSequence(
        ["minusSign", generators.optional(
            generators.char("-")
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

json.value = generators.or(
    defer(json, "array"),
    defer(json, "object"),
    defer(json, "string"),
    defer(json, "number"),
    defer(json, "bool"),
    defer(json, "null")
)

json.string = generators.transform(
    generators.sequence(
        generators.char("\""),
        generators.many(
            generators.constrain(
                consumers.char,
                function(c) { return c !== "\"" }
            )
        ),
        generators.char("\"")
    ),
    function(value) {
        return value[1].join("")
    }
)

json.number = generators.transform(
    generators.constrain(
        generators.labelledSequence(
            [
                "minusSign",
                generators.optional(generators.char("-"))
            ],
            [
                "leadingDigits",
                generators.optional(nonNegativeInteger)
            ],
            [
                "decimalPointAndDigits",
                generators.optional(
                    generators.labelledSequence(
                        ["decimalPoint", generators.char(".")],
                        ["decimalDigits", generators.many(consumers.digit)]
                    )
                )
            ],
            [
                "exponent",
                generators.optional(
                    generators.sequence(
                        generators.char("e"),
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

json.bool = generators.transform(
    generators.or(
        generators.string("true"),
        generators.string("false")
    ),
    function(value) {
        return value === "true"
    }
)

json.null = generators.transform(
    generators.string("null"),
    function() { return null }
)

json.array = generators.transform(
    generators.sequence(
        generators.char("["),
        consumers.optionalWhitespace,
        generators.list(
            json.value,
            generators.wrapOptionalWhitespace(
                generators.char(",")
            )
        ),
        consumers.optionalWhitespace,
        generators.char("]")
    ),
    function(value) {
        return value[2]
    }
)

json.object = generators.transform(
    generators.sequence(
        generators.char("{"),
        consumers.optionalWhitespace,
        generators.list(
            generators.labelledSequence(
                ["key", json.string],
                ["separator", generators.wrapOptionalWhitespace(
                    generators.char(":")
                )],
                ["value", json.value]
            ),
            generators.wrapOptionalWhitespace(
                generators.char(",")
            )
        ),
        consumers.optionalWhitespace,
        generators.char("}")
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