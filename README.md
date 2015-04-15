# parser
A Javascript parsing library.

# TinyCpp Demo
A quick demo is available to see the parser output for tinyCpp:
```
cd tinyCpp/demo
node parseStuff.js
```

Which will parse stuff.cpp, and currently outputs the following:
```
[
    {
        "label": "function",
        "value": {
            "heading": {
                "returnType": "int",
                "name": "fib",
                "arguments": [
                    {
                        "type": "int",
                        "name": "n"
                    }
                ]
            },
            "body": [
                {
                    "label": "controlStructure",
                    "value": {
                        "label": "if",
                        "value": {
                            "condition": {
                                "label": "variable",
                                "value": "n"
                            },
                            "body": [
                                {
                                    "label": "controlStructure",
                                    "value": {
                                        "label": "if",
                                        "value": {
                                            "condition": {
                                                "label": "expressionTree",
                                                "value": {
                                                    "lhs": {
                                                        "label": "variable",
                                                        "value": "n"
                                                    },
                                                    "operator": "-",
                                                    "rhs": {
                                                        "label": "value",
                                                        "value": 1
                                                    }
                                                }
                                            },
                                            "body": [
                                                {
                                                    "label": "return",
                                                    "value": {
                                                        "label": "expressionTree",
                                                        "value": {
                                                            "lhs": {
                                                                "label": "functionCall",
                                                                "value": {
                                                                    "name": "fib",
                                                                    "arguments": [
                                                                        {
                                                                            "label": "expressionTree",
                                                                            "value": {
                                                                                "lhs": {
                                                                                    "label": "variable",
                                                                                    "value": "n"
                                                                                },
                                                                                "operator": "-",
                                                                                "rhs": {
                                                                                    "label": "value",
                                                                                    "value": 2
                                                                                }
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            },
                                                            "operator": "+",
                                                            "rhs": {
                                                                "label": "functionCall",
                                                                "value": {
                                                                    "name": "fib",
                                                                    "arguments": [
                                                                        {
                                                                            "label": "expressionTree",
                                                                            "value": {
                                                                                "lhs": {
                                                                                    "label": "variable",
                                                                                    "value": "n"
                                                                                },
                                                                                "operator": "-",
                                                                                "rhs": {
                                                                                    "label": "value",
                                                                                    "value": 1
                                                                                }
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            ],
                                            "continuation": {
                                                "success": true,
                                                "value": {
                                                    "elseBody": {
                                                        "label": "codeBlock",
                                                        "value": [
                                                            {
                                                                "label": "return",
                                                                "value": {
                                                                    "label": "value",
                                                                    "value": 1
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            ],
                            "continuation": {
                                "success": true,
                                "value": {
                                    "elseBody": {
                                        "label": "codeBlock",
                                        "value": [
                                            {
                                                "label": "return",
                                                "value": {
                                                    "label": "value",
                                                    "value": 0
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        }
    },
    {
        "label": "function",
        "value": {
            "heading": {
                "returnType": "int",
                "name": "main",
                "arguments": []
            },
            "body": [
                {
                    "label": "return",
                    "value": {
                        "label": "functionCall",
                        "value": {
                            "name": "fib",
                            "arguments": [
                                {
                                    "label": "value",
                                    "value": 5
                                }
                            ]
                        }
                    }
                }
            ]
        }
    }
]
```

There are also lots of unit tests which give lots of example program snippets and expected outputs at tinyCpp/test/cppParse.js and can be run with:
```
mocha tinyCpp/test/cppParse.js
```
