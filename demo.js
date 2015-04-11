"use strict"

var stream = require("./stream")
var jsonParser = require("./json")

window.json = function(str) {
    return jsonParser(new stream(str))
}