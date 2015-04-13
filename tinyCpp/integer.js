"use strict"

var assert = require("assert")

module.exports = function int(value) {
	assert(value === Math.floor(value))

	value += Math.pow(2, 31)
	value %= Math.pow(2, 32)
	value -= Math.pow(2, 31)

	this.type = "int"
	this.value = value
}