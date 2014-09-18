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

  var callbackHelper = require('../../helper/callback'),
    args = require('../../helper/args'),
    StopIterationError = require('./stopiteration');


  function handleStep(fn, resolve, reject, value) {

    if (value instanceof StopIterationError) {
      resolve();
      return true;
    }

    if (value instanceof Error) {
      reject(value);
      return true;
    }

    fn.apply(undefined, args.apply(undefined, arguments).slice(3));
    return false;

  }

  function doForEach(iterator, fn, resolve, reject, stop) {

    if (!!stop) {
      return undefined;
    }

    var step = handleStep.bind(undefined, fn, resolve, reject),
      next = doForEach.bind(undefined, iterator, fn, resolve, reject);

    iterator.next().then(step, step).then(next);

  }

  function forEach(iterator, fn, callback) {

    var helper = callbackHelper.call(undefined, callback);

    doForEach(iterator, fn, helper.resolve, helper.reject);

    return helper.response;

  }

  return forEach;

}());
