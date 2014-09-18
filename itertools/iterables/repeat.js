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
    Iterator = require('../core/iterator'),
    Iterable = require('../core/iterable'),
    StopIterationError = require('../core/stopiteration');

  function RepeatIterator(value, times) {

    Iterator.call(this);
    this.value = value;
    this.times = times || undefined;
    this.count = 0;

  }
  util.inherits(RepeatIterator, Iterator);

  RepeatIterator.prototype.iterTimes = function iterTimes(resolve, reject) {

    if (this.count >= this.times) {
      reject(new StopIterationError());
      return undefined;
    }

    resolve(this.value);
    this.count = this.count + 1;

  };

  RepeatIterator.prototype.iter = function iter(resolve, reject) {

    if (this.times !== undefined) {
      this.iterTimes(resolve, reject);
      return undefined;
    }

    resolve(this.value);

  };

  function RepeatIterable(value, times) {

    Iterable.call(this);
    this.value = value;
    this.times = times;

  }
  util.inherits(RepeatIterable, Iterable);

  RepeatIterable.prototype.iterator = function iterator() {

    return new RepeatIterator(this.value, this.times);

  };

  return RepeatIterable;

}());
