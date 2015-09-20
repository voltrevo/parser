"use strict"

var parser = require("./parser")
var stream = require("./stream")
var jsonParser = require("./json/json")
var tinyCpp = require("./tinyCpp/cppParse")

window.json = function(str) {
    return jsonParser(new stream(str))
}

window.cpp = function(str) {
    return parser.mustConsumeAll(tinyCpp)(new stream(str))
}

window.json.impl = jsonParser.impl
window.stream = stream
