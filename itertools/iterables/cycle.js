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
    iter = require('./iter'),
    Iterator = require('../core/iterator'),
    Iterable = require('../core/iterable'),
    StopIterationError = require('../core/stopiteration');

  function CycleIterator(iterable) {

    Iterator.call(this);
    this.source = iter(iterable, true);
    this.cache = [];
    this.length = 0;
    this.offset = 0;
    this.sourceExhausted = false;

  }
  util.inherits(CycleIterator, Iterator);

  CycleIterator.prototype.iterFromSource = function iterFromSource(resolve, reject) {

    this.source.next().then(function (v) {
      this.cache.push(v);
      resolve(v);
    }.bind(this), function (e) {
      if (e instanceof StopIterationError) {
        this.sourceExhausted = true;
        this.length = this.cache.length;
        this.iterFromCache(resolve);
        return undefined;
      }
      reject(e);
    }.bind(this));

  };

  CycleIterator.prototype.iterFromCache = function iterFromCache(resolve) {

    resolve(this.cache[this.offset]);
    this.offset = (this.offset + 1) % this.length;

  };

  CycleIterator.prototype.iter = function iter(resolve, reject) {

    if (this.sourceExhausted === true) {
      this.iterFromCache(resolve);
      return undefined;
    }

    this.iterFromSource(resolve, reject);

  };

  function CycleIterable(iterable) {

    Iterable.call(this);
    this.source = iterable;

  }
  util.inherits(CycleIterable, Iterable);

  CycleIterable.prototype.iterator = function iterator() {

    return new CycleIterator(this.source);

  };

  return CycleIterable;

}());
