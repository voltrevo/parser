"use strict"

var expect = require("chai").expect

var parser = require("../../parser")
var stream = require("../../stream")
var cpp = require("../cppParse").impl

var testTemplate = function(consumerName, opts) {
	var consumer = parser.mustConsumeAll(cpp[consumerName])

	describe(consumerName, function() {
		if (opts.valid) {
			describe("succeeds for valid inputs", function() {
				opts.valid.map(function(inputOutput) {
					return {
						input: inputOutput[0],
						expectedOutput: {
							exists: inputOutput.length >= 2,
							value: inputOutput[1]
						},
						actualOutput: consumer(new stream(inputOutput[0]))
					}
				}).forEach(function(testCase) {
					it(JSON.stringify(testCase.input), function() {
						expect(testCase.actualOutput.success).to.equal(true)

						if (testCase.expectedOutput.exists) {
							expect(testCase.actualOutput.value).to.deep.equal(testCase.expectedOutput.value)
						}
					})
				})
			})
		}

		if (opts.invalid) {
			describe("fails for invalid inputs", function() {
				opts.invalid.map(function(str) {
					return {
						input: str,
						output: consumer(new stream(str))
					}
				}).forEach(function(testCase) {
					it(JSON.stringify(testCase.input), function() {
						expect(testCase.output.success).to.equal(false)
					})
				})
			})
		}
	})
}

describe("cpp", function() {
	testTemplate("identifier", {
		valid: [
			["_", "_"],
			["foo", "foo"],
			["bar", "bar"],
			["_x", "_x"],
			["_0", "_0"],
			["foo0123bar", "foo0123bar"],
			["x_", "x_"],
			["_x_", "_x_"],
			["_x_0", "_x_0"]
		],
		invalid: [
			"0",
			"7foo",
			"foo$bar",
			"",
			" ",
			" foo",
			"foo "
		]
	})

	testTemplate("typename", {
		valid: [
			["int", "int"]
		],
		invalid: [
			" int",
			""
		]
	})

	testTemplate("integer", {
		valid: [
			["0", 0],
			["-0", -0],
			["123", 123],
			["-123", -123]
		],
		invalid: [
			"",
			" 0",
			"0 ",
			" ",
			"x",
			"NaN"
		]
	})

	// TODO: constantValue

	testTemplate("globalVariableDeclaration", {
		valid: [
			["int x = 0;", {
				type: "int",
				name: "x",
				value: 0
			}],
			["int x=0;", {
				type: "int",
				name: "x",
				value: 0
			}],
			["int foo = -123;", {
				type: "int",
				name: "foo",
				value: -123
			}]
		],
		invalid: [
			"",
			"int x;",
			"int",
			" int x = 0;",
			"intx=0;",
			"int foo = bar;",
			"int x = 0"
		]
	})

	testTemplate("argumentList", {
		valid: [
			["", []],
			["int x", [
				{type: "int", name: "x"}
			]],
			["int x, int y", [
				{type: "int", name: "x"},
				{type: "int", name: "y"}
			]],
			["int x , int y", [
				{type: "int", name: "x"},
				{type: "int", name: "y"}
			]],
			["int x ,int y", [
				{type: "int", name: "x"},
				{type: "int", name: "y"}
			]],
			["int x, int y, int z", [
				{type: "int", name: "x"},
				{type: "int", name: "y"},
				{type: "int", name: "z"}
			]]
		],
		invalid: [
			" ",
			" int x",
			"void x",
			"x",
			"int x,,int y",
			"int x,"
		]
	})

	testTemplate("functionForwardDeclaration", {
		valid: [
			["int foo();", {
				returnType: "int",
				name: "foo",
				arguments: []
			}]
		],
		invalid: [
			"intfoo();"
		]
	})

	testTemplate("block", {
		valid: [
			["{}"],
			["{ }"],
			["{ int x = 3; }"]
		],
		invalid: [
			"",
			"{",
			"{}}",
			"{{}"
		]
	})

	testTemplate("operator", {
		valid: [
			["+", "+"],
			["-", "-"],
			["*", "*"],
			["/", "/"],
			["=", "="]
		],
		invalid: [
			"",
			" +",
			"+ ",
			"+-"
		]
	})

	testTemplate("tokenize", {
		valid: [
			[""],
			["+ -"],
			["x + y * z"],
			["x+y*z"],
			["x(1)"],
			["x(1, 2)"]
		],
		invalid: [
			" " // TODO: undecided whether this should actually fail
		]
	})

	testTemplate("expression", {
		valid: [
			["0", {
				label: "value",
				value: 0
			}],
			["x", {
				label: "variable",
				value: "x"
			}],
			["1 + 1", {
				label: "expressionTree",
				value: {
					lhs: {
						label: "value",
						value: 1
					},
					operator: "+",
					rhs: {
						label: "value",
						value: 1
					}
				}
			}],
			["1+1", {
				label: "expressionTree",
				value: {
					lhs: {
						label: "value",
						value: 1
					},
					operator: "+",
					rhs: {
						label: "value",
						value: 1
					}
				}
			}],
			["1 + -1", {
				label: "expressionTree",
				value: {
					lhs: {
						label: "value",
						value: 1
					},
					operator: "+",
					rhs: {
						label: "value",
						value: -1
					}
				}
			}],
			["1 + 2 * 3", {
				label: "expressionTree",
				value: {
					lhs: {
						label: "value",
						value: 1
					},
					operator: "+",
					rhs: {
						label: "expressionTree",
						value: {
							lhs: {
								label: "value",
								value: 2
							},
							operator: "*",
							rhs: {
								label: "value",
								value: 3
							}
						}
					}
				}
			}],
			["x = 1 + 1", {
				label: "expressionTree",
				value: {
					lhs: {
						label: "variable",
						value: "x"
					},
					operator: "=",
					rhs: {
						label: "expressionTree",
						value: {
							lhs: {
								label: "value",
								value: 1
							},
							operator: "+",
							rhs: {
								label: "value",
								value: 1
							}
						}
					}
				}
			}],
			["(1 + 1)", {
				label: "expressionTree",
				value: {
					lhs: {
						label: "value",
						value: 1
					},
					operator: "+",
					rhs: {
						label: "value",
						value: 1
					}
				}
			}],
			["sum(1, 2)", {
				label: "functionCall",
				value: {
					name: "sum",
					arguments: [
						{
							label: "value",
							value: 1
						},
						{
							label: "value",
							value: 2
						}
					]
				}
			}],
			["sum(1, sum(2, 3))", {
				label: "functionCall",
				value: {
					name: "sum",
					arguments: [
						{
							label: "value",
							value: 1
						},
						{
							label: "functionCall",
							value: {
								name: "sum",
								arguments: [
									{
										label: "value",
										value: 2
									},
									{
										label: "value",
										value: 3
									}
								]
							}
						}
					]
				}
			}]
		],
		invalid: [
			"",
			" ",
			"+",
			"x+",
			"1 + 1;"
		]
	})

	testTemplate("expressionStatement", {
		valid: [
			["1 + 1;", {
				label: "expressionTree",
				value: {
					lhs: {
						label: "value",
						value: 1
					},
					operator: "+",
					rhs: {
						label: "value",
						value: 1
					}
				}
			}]
		],
		invalid: [
			"1 + 1"
		]
	})

	testTemplate("variableDeclaration", {
		valid: [
			["int x = 3;", {
				type: "int",
				name: "x",
				expression: {
					label: "value",
					value: 3
				}
			}],
			["int x = 1 + 1;", {
				type: "int",
				name: "x",
				expression: {
					label: "expressionTree",
					value: {
						lhs: {
							label: "value",
							value: 1
						},
						operator: "+",
						rhs: {
							label: "value",
							value: 1
						}
					}
				}
			}]
		],
		invalid: [
			"int x = 3",
			"x = 3;",
			"3;"
		]
	})

	testTemplate("returnStatement", {
		valid: [
			["return 0;", {
				label: "value",
				value: 0
			}]
		],
		invalid: [
			"",
			";",
			"0;",
			"return;" // TODO: make this valid
		]
	})

	testTemplate("codeBlock", {
		valid: [
			["{}", []],
			["{ }", []],
			["{ 3; }", [
				{
					label: "expression",
					value: {
						label: "value",
						value: 3
					}
				}
			]],
			["{ x = 3; y = 4; }", [
				{
					label: "expression",
					value: {
						label: "expressionTree",
						value: {
							lhs: {
								label: "variable",
								value: "x"
							},
							operator: "=",
							rhs: {
								label: "value",
								value: 3
							}
						}
					}
				},
				{
					label: "expression",
					value: {
						label: "expressionTree",
						value: {
							lhs: {
								label: "variable",
								value: "y"
							},
							operator: "=",
							rhs: {
								label: "value",
								value: 4
							}
						}
					}
				}
			]],
			["{{}}", [
				{
					label: "controlStructure",
					value: {
						label: "codeBlock",
						value: []
					}
				}
			]]
		],
		invalid: [
			"",
			"{",
			"{{}",
			"{;}", // TODO: make this valid
			"{ 3 }",
			"{ x = 3; y = 4 }"
		]
	})

	testTemplate("if", {
		valid: [
			["if (1) {}", {
				condition: {
					label: "value",
					value: 1
				},
				body: [],
				continuation: {
					success: false,
					value: [[]]
				}
			}],
			["if (1 + 1) {{}}"],
			["if (1 + 2 * 3) { int foo = bar; }"],
			["if (1) {} else {}", {
				condition: {
					label: "value",
					value: 1
				},
				body: [],
				continuation: {
					success: true,
					value: {
						elseBody: {
							label: "codeBlock",
							value: []
						}
					}
				}
			}],
			["if (1) {} else if (1) {}"],
			["if (1) {} else if (1) {} else {}"],
			["if (1) {} else if (1) {} else if (1) {} else {}", {
				condition: {
					label: "value",
					value: 1
				},
				body: [],
				continuation: {
					success: true,
					value: {
						elseBody: {
							label: "if",
							value: {
								condition: {
									label: "value",
									value: 1
								},
								body: [],
								continuation: {
									success: true,
									value: {
										elseBody: {
											label: "if",
											value: {
												condition: {
													label: "value",
													value: 1
												},
												body: [],
												continuation: {
													success: true,
													value: {
														elseBody: {
															label: "codeBlock",
															value: []
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}],
			["if(1){}else if(1){}else if(1){}else{}"]
		],
		invalid: [
			"",
			"if",
			"if {}",
			"if () {}",
			"if (1) {} else",
			"if (1) {} else (1) {}"
		]
	})

	testTemplate("while", {
		valid: [
			["while (1) {}", {
				condition: {
					label: "value",
					value: 1
				},
				body: []
			}]
		]
	})

	testTemplate("statement", {
		valid: [
			["int x = 3;"],
			["return 0;"],
			["0;"],
			["{}"],
			["if (1) {}"],
			["while (1) {}"]
		],
		invalid: [
			"",
			";" // TODO: make this valid
		]
	})

	testTemplate("function", {
		valid: [
			["int foo() {}"],
			["int foo() { }"],
			["int sum(int x, int y) { return x + y; }", {
				heading: {
					returnType: "int",
					name: "sum",
					arguments: [
						{
							type: "int",
							name: "x"
						},
						{
							type: "int",
							name: "y"
						}
					]
				},
				body: [
					{
						label: "return",
						value: {
							label: "expressionTree",
							value: {
								lhs: {
									label: "variable",
									value: "x"
								},
								operator: "+",
								rhs: {
									label: "variable",
									value: "y"
								}
							}
						}
					}
				]
			}]
		],
		invalid: [
			"",
			"intfoo(){}",
			"int foo() { int bar() {} }", // TODO: make this valid
			"int foo(int) {}", // TODO: make this valid
			"int(int){}",
			"int foo() { { x } }"
		]
	})

	testTemplate("topLevelElement", {
		valid: [
			["int foo() {}"],
			["int foo();"],
			["int x = 3;"]
		],
		invalid: [
			"",
			"int x = 1 + 1;", // TODO: make this valid
			"int foo()"
		]
	})

	testTemplate("program", {
		valid: [
			["", []],
			["int x = 3; int foo(); int foo() {}", [
				{
					label: "globalVariableDeclaration",
					value: {
						type: "int",
						name: "x",
						value: 3
					}
				},
				{
					label: "functionForwardDeclaration",
					value: {
						returnType: "int",
						name: "foo",
						arguments: []
					}
				},
				{
					label: "function",
					value: {
						heading: {
							returnType: "int",
							name: "foo",
							arguments: []
						},
						body: []
					}
				}
			]],
			[" "]
		]
	})
})