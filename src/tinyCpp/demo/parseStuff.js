"use strict"

var fs = require("fs")
var stream = require("../../stream")
var cpp = require("../cppParse")

console.log(JSON.stringify(cpp(new stream(fs.readFileSync("stuff.cpp").toString())).value, null, 4))
