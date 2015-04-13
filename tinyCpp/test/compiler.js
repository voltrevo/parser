"use strict"

var expect = require("chai").expect

var stream = require("../../stream")
var parser = require("../cppParse")
var compiler = require("../compiler")

var compile = function(str) {
	var programStructure = parser(new stream(str))

	if (!programStructure.success) {
		return "Parsing failed"
	}

	return compiler(programStructure.value)
}

describe("compile", function() {
	it("succeeds with empty program", function() {
		expect(compile("")).to.deep.equal({
			failed: false,
			messages: [],
			program: {
				global: {
					functions: {
						declarations: {},
						definitions: {}
					},
					variables: {}
				}
			}
		})
	})

	it("succeeds with global variable declaration", function() {
		expect(compile("int x = 3;")).to.deep.equal({
			failed: false,
			messages: [],
			program: {
				global: {
					functions: {
						declarations: {},
						definitions: {}
					},
					variables: {
						x: {
							type: "int",
							value: 3
						}
					}
				}
			}
		})
	})

	it("succeeds with function forward declaration", function() {
		expect(compile("int foo();")).to.deep.equal({
			failed: false,
			messages: [],
			program: {
				global: {
					functions: {
						declarations: {
							"foo()": true
						},
						definitions: {}
					},
					variables: {}
				}
			}
		})
	})

	it("stuff", function() {
		expect(compile("int x() {}")).to.deep.equal({})
	})
})