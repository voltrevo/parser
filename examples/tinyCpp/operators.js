"use strict"

var int = require("./integer")
var cppFunction = require("./function")

module.exports = {
	"+": cppFunction({
		"int,int": function(x, y) {
			return new int(x.value + y.value)
		}
	}),
	"-": cppFunction({
		"int,int": function(x, y) {
			return new int(x.value - y.value)
		}
	}),
	"*": cppFunction({
		"int,int": function(x, y) {
			return new int(x.value * y.value)
		}
	}),
	"/": cppFunction({
		"int,int": function(x, y) {
			return new int(Math.floor(x.value / y.value))
		}
	})
}