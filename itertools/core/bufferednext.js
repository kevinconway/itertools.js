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
    Deferred = require('deferredjs').Deferred,
    when = require('deferredjs').when,
    Iterator = require('./iterator'),
    callbackHelper = require('../../helper/callback');

  function BufferedNextIterator() {

    Iterator.call(this);
    this.promise = when();

  }
  util.inherits(BufferedNextIterator, Iterator);

  function IterWrapper(thisArg, input, resolve, reject) {

    return function iterWrapper() {
      var d = new Deferred();

      function bufferedResolve() {
        d.resolve();
        resolve.apply(undefined, arguments);
      }
      function bufferedReject() {
        d.resolve();
        reject.apply(undefined, arguments);
      }

      thisArg.iter.apply(thisArg, input.concat([bufferedResolve, bufferedReject]));

      return d.promise();
    };

  }
  BufferedNextIterator.prototype.next = function next() {

    var helper = callbackHelper.apply(undefined, arguments);

    this.promise = this.promise.then(
      new IterWrapper(this, helper.input, helper.resolve, helper.reject)
    );

    return helper.response;

  };

  return BufferedNextIterator;

}());
