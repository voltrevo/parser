# parser [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> A parser library based on functional composition of stream consumers.


## Install

```sh
$ npm install --save voltrevo-parser
```


## Usage

```js
'use strict';

var parser = require('parser');

var foo = parser.string('foo');
var bar = parser.string('bar');
var baz = parser.string('baz');

var demo = parser.sequence(
  parser.oneOrMore(foo),
  parser.many(bar),
  baz
);

var stream = parser.stream('foobarbarbarbaz');

console.log(demo(stream));
```

## License

MIT © [Andrew Morris](http://andrewmorris.io/)


[npm-image]: https://badge.fury.io/js/voltrevo-parser.svg
[npm-url]: https://npmjs.org/package/voltrevo-parser
[travis-image]: https://travis-ci.org/voltrevo/parser.svg?branch=master
[travis-url]: https://travis-ci.org/voltrevo/parser
[daviddm-image]: https://david-dm.org/voltrevo/parser.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/voltrevo/parser
[coveralls-image]: https://coveralls.io/repos/voltrevo/parser/badge.svg
[coveralls-url]: https://coveralls.io/r/voltrevo/parser
