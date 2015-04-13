"use strict"

var assert = require("assert")

module.exports = function int(value) {
	assert(value === Math.floor(value))

	// emulate overflow
	value += Math.pow(2, 31)
	value %= Math.pow(2, 32)
	value -= Math.pow(2, 31)

	this.type = "int"
	this.value = value
}