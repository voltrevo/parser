"use strict"

var stream = require("./stream")
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

cpp.operator = parser.or(
    parser.char("+"),
    parser.char("-"),
    parser.char("*"),
    parser.char("/"),
    parser.char("=")
)

cpp.parenthesis = parser.or(
    parser.char("("),
    parser.char(")")
)

cpp.operatorSets = [
    ["="],
    ["+", "-"],
    ["*", "/"]
]

cpp.tokenize = parser.transform(
    parser.many(
        parser.wrapOptionalWhitespace(
            parser.labelledOr(
                ["value", cpp.integer],
                ["operator", cpp.operator],
                ["parenthesis", cpp.parenthesis],
                ["value", cpp.identifier]
            )
        )
    ),
    function(value) {
        return new stream(value)
    }
)

cpp.expressionParenthesisExtractor = parser.transform(
    parser.many(
        parser.or(
            parser.layer(
                parser.block(
                    parser.if(function(token) {
                        return token.value === "("
                    }),
                    parser.if(function(token) {
                        return token.value === ")"
                    })
                ),
                parser.defer(cpp, "expression")
            ),
            parser.any
        )
    ),
    function(value) {
        return new stream(value)
    }
)

cpp.expressionOperatorExtractor = function(index) {
    var operatorSet = cpp.operatorSets[index]

    if (!operatorSet) {
        return parser.if(function(token) {
            return token.label === "value" || token.label === "expressionTree"
        })
    }

    var currExtractor = parser.transform(
        parser.labelledSequence(
            ["lhs", parser.layer(
                parser.transform(
                    parser.oneOrMore(
                        parser.if(function(token) {
                            return operatorSet.indexOf(token.value) === -1
                        })
                    ),
                    function(value) {
                        return new stream(value)
                    }
                ),
                cpp.expressionOperatorExtractor(index + 1)
            )],
            ["operatorAndRhs", parser.optional(
                parser.labelledSequence(
                    ["operator", parser.if(function(token) {
                        return operatorSet.indexOf(token.value) !== -1
                    })],
                    ["rhs", function(stream) {
                        return currExtractor(stream)
                    }]
                )
            )]
        ),
        function(value) {
            if (!value.operatorAndRhs.success) {
                return value.lhs
            }

            return {
                label: "expressionTree",
                value: {
                    lhs: value.lhs,
                    operator: value.operatorAndRhs.value.operator.value,
                    rhs: value.operatorAndRhs.value.rhs
                }
            }
        }
    )

    return currExtractor
}

cpp.tokenExpression = parser.layer(
    cpp.expressionParenthesisExtractor,
    cpp.expressionOperatorExtractor(0)
)

cpp.expression = parser.layer(
    cpp.tokenize,
    cpp.tokenExpression
)

cpp.expressionStatement = parser.layer(
    parser.until(parser.char(";")),
    cpp.expression
)

cpp.variableDeclaration = parser.transform(
    parser.labelledSequence(
        ["type", cpp.typename],
        ["w1", parser.whitespace],
        ["name", cpp.identifier],
        ["w2", parser.whitespace],
        ["equals", parser.char("=")],
        ["w3", parser.optionalWhitespace],
        ["expression", cpp.expressionStatement]
    ),
    function(value) {
        delete value.w1
        delete value.w2
        delete value.equals
        delete value.w3

        return value
    }
)

cpp.returnStatement = parser.transform(
    parser.sequence(
        parser.string("return"),
        parser.whitespace,
        cpp.expressionStatement
    ),
    function(value) {
        return value[2]
    }
)

cpp.codeBlock = parser.layer(
    cpp.block,
    parser.many(
        parser.wrapOptionalWhitespace(
            parser.defer(cpp, "statement")
        )
    )
)

/*
cpp.if = parser.labelledSequence(
    ["ifKeyword", parser.string("if")],
    ["w1", parser.optionalWhitespace],

)
*/

cpp.statement = parser.labelledOr(
    ["variableDeclaration", cpp.variableDeclaration],
    ["return", cpp.returnStatement],
    ["expression", cpp.expressionStatement],
    ["codeBlock", cpp.codeBlock]
    /*["controlStructure", parser.labelledOr(
        ["codeBlock", cpp.codeBlock],
        ["if", cpp.if]
    )]*/
)

cpp.function = parser.transform(
    parser.labelledSequence(
        ["heading", cpp.functionHeading],
        ["w1", parser.optionalWhitespace],
        ["body", cpp.codeBlock]
    ),
    function(value) {
        delete value.w1

        return value
    }
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