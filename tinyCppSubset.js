"use strict"

var parser = require("./parser")

var cpp = {}

cpp.identifier = parser.transform(
    parser.constrain(
        parser.oneOrMore(
            parser.regexChar(/^[a-zA-Z0-9_]$/)
        ),
        function(value) {
            return !/^[0-9]$/.test(value[0])
        }
    ),
    function(value) {
        return value.join("")
    }
)

cpp.typename = parser.transform(
    parser.or(
        //parser.string("void"), TODO
        parser.string("int")
    ),
    function(value) {
        return value.join("") // TODO: this transform shouldn't be necessary
    }
)

cpp.integer = parser.transform(
    parser.sequence(
        parser.optional(parser.char("-")),
        parser.oneOrMore(parser.digit)
    ),
    function(value) {
        var minusSign = value[0]
        var digits = value[1]

        return (minusSign.success ? -1 : 1) * parseInt(digits.join(""))
    }
)

parser.constantValue = parser.or(
    cpp.integer
)

cpp.constantStatement = parser.transform(
    parser.labelledSequence(
        ["type", cpp.typename],
        ["w1", parser.optionalWhitespace],
        ["name", cpp.identifier],
        ["w2", parser.optionalWhitespace],
        ["equals", parser.char("=")],
        ["w3", parser.optionalWhitespace],
        ["value", parser.constantValue],
        ["semicolon", parser.char(";")]
    ),
    function(value) {
        delete value.w1
        delete value.w2
        delete value.equals
        delete value.w3
        delete value.semicolon

        return value
    }
)

cpp.argumentList = parser.list(
    parser.transform(
        parser.sequence(
            cpp.typename,
            parser.whitespace,
            cpp.identifier
        ),
        function(value) {
            return {
                type: value[0],
                name: value[2]
            }
        }
    ),
    parser.wrapOptionalWhitespace(
        parser.char(",")
    )
)

cpp.functionHeading = parser.transform(
    parser.sequence(
        cpp.typename,
        parser.whitespace,
        cpp.identifier,
        parser.optionalWhitespace,
        parser.char("("),
        parser.wrapOptionalWhitespace(
            cpp.argumentList
        ),
        parser.char(")")
    ),
    function(value) {
        return {
            returnType: value[0],
            name: value[2],
            arguments: value[5]
        }
    }
)

cpp.functionForwardDeclaration = parser.transform(
    parser.sequence(
        cpp.functionHeading,
        parser.optionalWhitespace,
        parser.char(";")
    ),
    function(value) {
        return value[0]
    }
)

cpp.block = parser.block(
    parser.char("{"),
    parser.char("}")
)

cpp.function = parser.sequence(
    cpp.functionHeading,
    parser.optionalWhitespace,
    cpp.block
)

cpp.topLevelElement = parser.labelledOr(
    ["function", cpp.function],
    ["functionForwardDeclaration", cpp.functionForwardDeclaration],
    ["constantStatement", cpp.constantStatement]
)

cpp.program = parser.transform(
    parser.sequence(
        parser.many(
            parser.sequence(
                parser.optionalWhitespace,
                cpp.topLevelElement
            )
        ),
        parser.optionalWhitespace
    ),
    function(value) {
        return value[0].map(function(pair) {
            return pair[1]
        })
    }
)

module.exports = cpp.program