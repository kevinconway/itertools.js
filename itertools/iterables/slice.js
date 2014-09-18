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
    when = require('deferredjs').when,
    iter = require('./iter'),
    Iterator = require('../core/iterator'),
    Iterable = require('../core/iterable'),
    StopIterationError = require('../core/stopiteration');

  function SliceIterator(iterable, start, stop, step) {

    Iterator.call(this);
    this.source = iter(iterable);
    this.start = start || 0;
    this.started = false;
    this.stop = stop || undefined;
    this.count = 0;
    this.step = step || undefined;

  }
  util.inherits(SliceIterator, Iterator);

  SliceIterator.prototype.burn = function burn(count) {

    var x, p = when();
    count = count || 0;
    for (x = 0; x < count; x = x + 1) {
      p = p.then(this.source.next.bind(this.source));
      this.count = this.count + 1;
    }
    return p.then(function () { this.started = true; }.bind(this));

  };

  SliceIterator.prototype.shouldStop = function shouldStop() {

    return this.stop !== undefined && this.count >= this.stop;

  };

  SliceIterator.prototype.iter = function iter(resolve, reject) {

    var p = when();

    if (this.started === false) {
      p = this.burn(this.start);
      this.started = true;
      if (this.shouldStop()) {
        reject(new StopIterationError());
        return undefined;
      }

      p.then(this.source.next.bind(this.source)).then(resolve, reject);

      return undefined;
    }

    if (this.step !== undefined) {
      p = p.then(this.burn.bind(this, this.step - 1));
    }

    if (this.shouldStop()) {
      reject(new StopIterationError());
      return undefined;
    }

    p.then(this.source.next.bind(this.source)).then(resolve, reject);

  };

  function SliceIterable(iterable, start, stop, step) {

    Iterable.call(this);
    this.source = iterable;
    this.start = start;
    this.stop = stop;
    this.step = step;

  }
  util.inherits(SliceIterable, Iterable);

  SliceIterable.prototype.iterator = function iterator() {

    return new SliceIterator(this.source, this.start, this.stop, this.step);

  };

  return SliceIterable;

}());
