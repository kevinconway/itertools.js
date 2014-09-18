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
    args = require('../../helper/args'),
    iter = require('./iter'),
    Iterator = require('../core/iterator'),
    Iterable = require('../core/iterable'),
    StopIterationError = require('../core/stopiteration');

  function ChainIterator() {

    Iterator.call(this);
    this.sources = args.apply(undefined, arguments).map(iter);
    this.source = this.sources.shift();

  }
  util.inherits(ChainIterator, Iterator);

  ChainIterator.prototype.changeSource = function changeSource() {
    this.source = this.sources.shift();
  };

  ChainIterator.prototype.iter = function iter(resolve, reject) {

    if (this.source === undefined) {
      reject(new StopIterationError());
      return undefined;
    }

    this.source.next().then(resolve, function (res, rej, err) {
      if (err instanceof StopIterationError) {
        this.changeSource();
        this.iter(res, rej);
        return undefined;
      }
      rej(err);
    }.bind(this, resolve, reject));

  };

  function ChainIterable() {

    Iterable.call(this);
    this.sources = args.apply(undefined, arguments);

  }
  util.inherits(ChainIterable, Iterable);

  ChainIterable.prototype.iterator = function iterator() {

    var i = Object.create(ChainIterator.prototype);
    ChainIterator.apply(i, this.sources);
    return i;

  };

  return ChainIterable;

}());
