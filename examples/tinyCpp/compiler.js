"use strict"

var builtinTypes = require("./builtinTypes")

var compiler = {}

compiler.initProgram = function() {
	return {
		global: {
			variables: {},
			functions: {
				declarations: {},
				definitions: {}
			}
		}
	}
}

compiler.initCompilation = function() {
	var compilation = {
		state: {
			program: compiler.initProgram(),
			messages: [],
			failed: false
		},
		warn: function(msg) {
			compilation.state.messages.push({type: "warn", msg: msg})
		},
		error: function(msg) {
			compilation.state.messages.push({type: "error", msg: msg})
			compilation.state.failed = true
		}
	}

	return compilation
}

compiler.addTopLevelElementToProgram = function(compilation, topLevelElement) {
	var handler = compiler.topLevelHandlers[topLevelElement.label + "Handler"]

	if (!handler) {
		compilation.error("No handler found for topLevelElement with label " + topLevelElement.label)
		return
	}

	handler(compilation, topLevelElement.value)
}

compiler.topLevelHandlers = {}

compiler.topLevelHandlers.globalVariableDeclarationHandler = function(compilation, gvd) {
	var globalVars = compilation.state.program.global.variables

	if (globalVars[gvd.name]) {
		compilation.error("Attempt to re-declare " + gvd.name)
		return
	}

	var type = builtinTypes[gvd.type]

	if (!type) {
		compilation.error("Type " + gvd.type + " not available")
		return
	}

	globalVars[gvd.name] = new type(gvd.value)
}

compiler.generateOverloadKey = function(name, args) {
	return (
		name +
		"(" +
		args.map(function(arg) {
			return arg.type
		}).join(",") +
		")"
	)
}

compiler.topLevelHandlers.functionForwardDeclarationHandler = function(compilation, ffd) {
	var overloadKey = compiler.generateOverloadKey(ffd.name, ffd.arguments)

	var globalFuncDecls = compilation.state.program.global.functions.declarations

	if (globalFuncDecls[overloadKey]) {
		compilation.warn("Ignoring duplicate forward declaration of function " + overloadKey)
		return
	}

	compilation.state.program.global.functions.declarations[overloadKey] = true
}

/* TODO compiler.topLevelHandlers.functionHandler = function(program, func) {

}*/

compiler.compile = function(programStructure) {
	var compilation = compiler.initCompilation()

	programStructure.forEach(function(topLevelElement) {
		compiler.addTopLevelElementToProgram(compilation, topLevelElement)
	})

	return compilation.state
}

compiler.compile.impl = compiler

module.exports = compiler.compile