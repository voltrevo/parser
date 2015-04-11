"use strict"

function stream(str) {
    this._str = str
    this._pos = 0
}

stream.prototype.next = function() {
    if (this._pos >= this._str.length) {
        return null
    }

    return this._str[this._pos++]
}

stream.prototype.peek = function() {
    return this._str[this._pos]
}

stream.prototype.mark = function() {
    var pos = this._pos
    var _this = this
    return function() {
        _this._pos = pos
    }
}

var defer = function(obj, prop) {
    return function() {
        return obj[prop].apply(undefined, arguments)
    }
}

var consumers = {}

var generators = {
    constrain: function(consumer, test) {
        return function(stream) {
            var restore = stream.mark()

            var res = consumer(stream)
            if (!res.success) {
                return res
            }

            if (!test(res.value)) {
                restore()
                res.success = false
            }

            return res
        }
    },
    regexChar: function(re) {
        return generators.constrain(
            defer(consumers, "char"),
            function(c) { return re.test(c) }
        )
    },
    char: function(requiredChar) {
        return generators.constrain(
            defer(consumers, "char"),
            function(c) { return c === requiredChar }
        )
    },
    many: function(consumer) {
        return function(stream) {
            var result = []
            
            while (true) {
                var ret = consumer(stream)
                if (!ret.success) {
                    break
                }
                result.push(ret.value)
            }

            return {
                success: true,
                value: result
            }
        }
    },
    oneOrMore: function(consumer) {
        return generators.constrain(
            generators.many(consumer),
            function(result) { return result.length >= 1 }
        )
    },
    optional: function(consumer) {
        return function(stream) {
            return {
                success: true,
                value: consumer(stream)
            }
        }
    },
    sequence: function(/* args... */) {
        var args = arguments
        return function(stream) {
            var restore = stream.mark()
            var result = []
            for (var i = 0; i !== args.length; i++) {
                var consumer = args[i]
                var ret = consumer(stream)
                if (!ret.success) {
                    restore()
                    return {
                        success: false,
                        value: result
                    }
                }
                result.push(ret.value)
            }

            return {
                success: true,
                value: result
            }
        }
    },
    labelledSequence: function(/* args... */) {
        var args = arguments

        return generators.transform(
            generators.sequence.apply(
                undefined,
                Array.prototype.map.call(
                    arguments,
                    function(labelledConsumer) {
                        return labelledConsumer[1]
                    }
                )
            ),
            function(value) {
                
                var newValue = {}

                for (var i = 0; i !== value.length; i++) {
                    newValue[args[i][0]] = value[i]
                }

                return newValue
            }
        )
    },
    string: function(requiredString) {
        return generators.sequence.apply(
            undefined,
            requiredString.split("").map(function(c) {
                return generators.char(c)
            }))
    },
    or: function(/* args */) {
        var args = arguments
        return function(stream) {
            for (var i = 0; i !== args.length; i++) {
                var ret = args[i](stream)
                if (ret.success) {
                    return ret
                }
            }

            return {
                success: false
            }
        }
    },
    rawList: function(itemConsumer, delimiterConsumer) {
        // TODO: make this return an array instead of the generated structure?
        return generators.optional(
            generators.sequence(
                itemConsumer,
                generators.many(
                    generators.sequence(
                        delimiterConsumer,
                        itemConsumer
                    )
                )
            )
        )
    },
    list: function(itemConsumer, delimiterConsumer) {
        return generators.transform(
            generators.rawList(itemConsumer, delimiterConsumer),
            function(value) {
                if (!value.success) {
                    return []
                }

                var result = [value.value[0]]

                for (var i = 0; i < value.value[1].length; i++) {
                    result.push(value.value[1][i][1])
                }

                return result
            }
        )
    },
    wrapOptionalWhitespace: function(consumer) {
        return generators.sequence(
            defer(consumers, "optionalWhitespace"),
            consumer,
            defer(consumers, "optionalWhitespace")
        )
    },
    transform: function(consumer, f) {
        return function(stream) {
            var ret = consumer(stream)

            if (ret.success) {
                ret.value = f(ret.value)
            }

            return ret
        }
    }
}

consumers.char = function(stream) {
    var ret = stream.next()
    
    return {
        success: ret !== null,
        value: ret
    }
}

consumers.alphaChar = generators.regexChar(/^[a-zA-Z]$/)
consumers.lowerChar = generators.regexChar(/^[a-z]$/)
consumers.upperChar = generators.regexChar(/^[A-Z]$/)

consumers.digit = generators.transform(
    generators.regexChar(/^[0-9]$/),
    function(value) {
        return value.charCodeAt(0) - "0".charCodeAt(0)
    }
)

consumers.whitespaceChar = generators.regexChar(/^[ \r\n\t]$/)
consumers.whitespace = generators.oneOrMore(consumers.whitespaceChar)
consumers.optionalWhitespace = generators.many(consumers.whitespaceChar)

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

var parser = function(str) {
    return json.value(new stream(str))
}

console.log(parser("[1,2,3, []]"))