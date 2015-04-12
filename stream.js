"use strict"

function stream(str) {
    this._str = str
    this._pos = 0
}

stream.prototype.next = function() {
    if (this.finished()) {
        return null
    }

    return this._str[this._pos++]
}

stream.prototype.finished = function() {
    return this._pos >= this._str.length
}

stream.prototype.peek = function() {
    return this._str[this._pos]
}

stream.prototype.mark = function() {
    var pos = this._pos
    var _this = this
    return function() {
        _this._pos = pos
    }
}

module.exports = stream