"use strict"

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

exports.generators = generators
exports.consumers = consumers
exports.defer = defer