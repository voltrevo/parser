"use strict"

var assert = require("assert")

var int = require("./integer")

var createOperator = function(overloadMap) {
	return function(lhs, rhs) {
		var overload = overloadMap[lhs.type + "," + rhs.type]
		assert(overload)
		return overload(lhs, rhs)
	}
}

module.exports = {
	"+": createOperator({
		"int,int": function(x, y) {
			return new int(x.value + y.value)
		}
	}),
	"-": createOperator({
		"int,int": function(x, y) {
			return new int(x.value + y.value)
		}
	}),
	"*": createOperator({
		"int,int": function(x, y) {
			return new int(x.value + y.value)
		}
	}),
	"/": createOperator({
		"int,int": function(x, y) {
			return new int(x.value + y.value)
		}
	})
}