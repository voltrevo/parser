"use strict"

var stream = require("./stream")

var parser = exports

parser.stream = stream

parser.defer = function(obj, prop) {
    return function() {
        return obj[prop].apply(undefined, arguments)
    }
}

parser.constrain = function(consumer, test) {
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
}

parser.regexChar = function(re) {
    return parser.constrain(
        parser.defer(parser, "anyChar"),
        function(c) { return re.test(c) }
    )
}

parser.char = function(requiredChar) {
    return parser.constrain(
        parser.defer(parser, "anyChar"),
        function(c) { return c === requiredChar }
    )
}

parser.many = function(consumer) {
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
}

parser.oneOrMore = function(consumer) {
    return parser.constrain(
        parser.many(consumer),
        function(result) { return result.length >= 1 }
    )
}

parser.optional = function(consumer) {
    return function(stream) {
        return {
            success: true,
            value: consumer(stream)
        }
    }
}

parser.sequence = function(/* args... */) {
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
}

parser.labelledSequence = function(/* args... */) {
    var args = arguments

    return parser.transform(
        parser.sequence.apply(
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
}

parser.string = function(requiredString) {
    return parser.sequence.apply(
        undefined,
        requiredString.split("").map(function(c) {
            return parser.char(c)
        }))
}

parser.or = function(/* args... */) {
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
}

parser.labelledOr = function(/* args... */) {
    var args = arguments

    return parser.or.apply(
        undefined,
        Array.prototype.map.call(args, function(pair) {
            return parser.transform(
                pair[1],
                function(value) {
                    return {
                        label: pair[0],
                        value: value
                    }
                }
            )
        })
    )
}

parser.rawList = function(itemConsumer, delimiterConsumer) {
    return parser.optional(
        parser.sequence(
            itemConsumer,
            parser.many(
                parser.sequence(
                    delimiterConsumer,
                    itemConsumer
                )
            )
        )
    )
}

parser.list = function(itemConsumer, delimiterConsumer) {
    return parser.transform(
        parser.rawList(itemConsumer, delimiterConsumer),
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
}

parser.rawWrapOptionalWhitespace = function(consumer) {
    return parser.sequence(
        parser.defer(parser, "optionalWhitespace"), // TODO: why is this deferred?
        consumer,
        parser.defer(parser, "optionalWhitespace")
    )
}

parser.wrapOptionalWhitespace = function(consumer) {
    return parser.transform(
        parser.rawWrapOptionalWhitespace(consumer),
        function(value) {
            return value[1]
        }
    )
}

parser.transform = function(consumer, f) {
    return function(stream) {
        var ret = consumer(stream)

        if (ret.success) {
            ret.value = f(ret.value)
        }

        return ret
    }
}

// DEPRECATED
parser.anyChar = function(stream) {
    var ret = stream.next()

    return {
        success: ret !== null,
        value: ret
    }
}

parser.any = function(stream) {
    if (stream.finished()) {
        return {
            success: false,
            value: null
        }
    }

    return {
        success: true,
        value: stream.next()
    }
}

parser.mustConsumeAll = function(consumer) {
    return function(stream) {
        var restore = stream.mark()
        var result = consumer(stream)

        if (!stream.finished()) {
            restore()
            return {
                success: false,
                value: result
            }
        }

        return result
    }
}

parser.layer = function(consumer, innerConsumer) {
    return function(stream) {
        var restore = stream.mark()

        var result = consumer(stream)
        if (!result.success) {
            restore()
            return {
                success: false,
                value: {
                    label: "consumer",
                    value: result.value
                }
            }
        }

        var innerResult = parser.mustConsumeAll(innerConsumer)(result.value)
        if (!innerResult.success) {
            restore()
            return {
                success: false,
                value: {
                    label: "innerConsumer",
                    value: innerResult.value
                }
            }
        }

        return innerResult
    }
}

parser.block = function(openConsumer, contentConsumer, closeConsumer) {
    return function(inputStream) {
        var restore = inputStream.mark() // TODO: should failure automatically reset the stream somehow?

        var depth = 0

        var firstOpenResult = openConsumer(inputStream)
        if (!firstOpenResult.success) {
            restore()
            return {
                success: false,
                value: {
                    label: "failed start",
                    value: firstOpenResult.value
                }
            }
        }

        depth++

        var innerStreamArray = []

        var bodyConsumer = parser.labelledOr(
            ["openConsumer", openConsumer],
            ["closeConsumer", closeConsumer],
            ["contentConsumer", contentConsumer]
        )

        while (true) {
            var result = bodyConsumer(inputStream)

            if (!result.success) {
                return {
                    success: false,
                    value: {
                        label: "failed mid-block",
                        value: result.value
                    }
                }
            }

            if (result.value.label === "openConsumer") {
                depth++
                innerStreamArray.push(result.value.value)
            }
            else if (result.value.label === "closeConsumer") {
                depth--

                if (depth === 0) {
                    break
                }

                innerStreamArray.push(result.value.value)
            }
            else {
                innerStreamArray = innerStreamArray.concat(result.value.value)
            }
        }

        return {
            success: true,
            value: new stream(innerStreamArray)
        }
    }
}

parser.until = function(endConsumer) {
    return function(inputStream) {
        var restore = inputStream.mark()

        var consumer = parser.labelledOr(
            ["endConsumer", endConsumer],
            ["anyChar", parser.anyChar]
        )

        var innerStreamString = ""

        while (true) {
            var result = consumer(inputStream)

            if (!result.success) {
                restore()
                return {
                    success: false,
                    value: result.value
                }
            }

            if (result.value.label === "endConsumer") {
                return {
                    success: true,
                    value: new stream(innerStreamString)
                }
            }

            innerStreamString += result.value.value
        }
    }
}

// TODO: consider renaming... parser.require, parser.satisfy? (this is not because of the conflict with the if keyword)
parser.if = function(test) {
    return parser.constrain(
        parser.any,
        test
    )
}

parser.alphaChar = parser.regexChar(/^[a-zA-Z]$/)
parser.lowerChar = parser.regexChar(/^[a-z]$/)
parser.upperChar = parser.regexChar(/^[A-Z]$/)
parser.digit = parser.regexChar(/^[0-9]$/)
parser.whitespaceChar = parser.regexChar(/^[ \r\n\t]$/)
parser.whitespace = parser.oneOrMore(parser.whitespaceChar)
parser.optionalWhitespace = parser.many(parser.whitespaceChar)
