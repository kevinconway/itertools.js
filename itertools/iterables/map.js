/*
The MIT License (MIT)
Copyright (c) 2014 Kevin Conway

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*jslint node: true, indent: 2, passfail: true, continue: true */

module.exports = (function () {
  "use strict";

  var util = require('util'),
    All = require('deferredjs').collection.All,
    args = require('../../helper/args'),
    iter = require('./iter'),
    Iterator = require('../core/iterator'),
    Iterable = require('../core/iterable');

  function MapIterator() {

    Iterator.call(this);
    this.sources = args.apply(undefined, arguments);
    this.fn = this.sources.shift();
    this.sources = this.sources.map(iter);
    this.length = this.sources.length;

  }
  util.inherits(MapIterator, Iterator);

  MapIterator.prototype.getNextValues = function getNextValues() {
    var promises = [],
      x;

    for (x = 0; x < this.length; x = x + 1) {

      promises.push(this.sources[x].next());

    }

    return promises;
  };

  MapIterator.prototype.iter = function iter(resolve, reject) {

    All.apply(undefined, this.getNextValues()).then(
      Function.prototype.apply.bind(this.fn, undefined)
    ).then(resolve).then(undefined, reject);

  };

  function MapIterable() {

    Iterable.call(this);
    this.params = args.apply(undefined, arguments);

  }
  util.inherits(MapIterable, Iterable);

  MapIterable.prototype.iterator = function iterator() {

    var i = Object.create(MapIterator.prototype);
    MapIterator.apply(i, this.params);
    return i;

  };

  return MapIterable;

}());
