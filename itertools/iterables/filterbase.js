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
    StopIterationError = require('../core/stopiteration'),
    testExcepted = {};

  function truthy(v) {
    if (v) {
      return true;
    }
    return false;
  }

  function FilterIteratorBase(test, iterable) {

    Iterator.call(this);
    this.source = iter(iterable);
    this.testFn = test || truthy;
    this.stopIter = false;

  }
  util.inherits(FilterIteratorBase, Iterator);

  FilterIteratorBase.prototype.stop = function stop() {
    this.stopIter = true;
  };

  FilterIteratorBase.prototype.runTestFn = function runTestFn(reject, value) {

    try {
      return this.testFn(value);
    } catch (err) {
      reject(err);
      return testExcepted;
    }

  };

  FilterIteratorBase.prototype.runTest = function runTest(resolve, reject, value) {

    var testResult = this.runTestFn(reject, value);

    if (testResult === testExcepted) {
      return undefined;
    }

    when(testResult).then(this.test.bind(this, resolve, reject, value));

  };

  FilterIteratorBase.prototype.iter = function iter(resolve, reject) {

    if (this.stopIter) {
      reject(new StopIterationError());
      return undefined;
    }

    this.source.next().then(this.runTest.bind(this, resolve, reject), reject);

  };

  return FilterIteratorBase;

}());
