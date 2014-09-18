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
    Iterator = require('./iterator'),
    Iterable = require('./iterable'),
    ArrayIterable = require('./arrayiter');

  function ObjectKeysIterable(obj) {

    Iterator.call(this);
    this.object = obj;

  }
  util.inherits(ObjectKeysIterable, Iterator);

  ObjectKeysIterable.prototype.iterator = function iterator() {

    return new ArrayIterable(Object.keys(this.object)).iterator();

  };

  function ObjectValuesIterator(obj) {

    Iterator.call(this);
    this.keys = new ObjectKeysIterable(obj).iterator();
    this.object = obj;

  }
  util.inherits(ObjectValuesIterator, Iterator);

  ObjectValuesIterator.prototype.iter = function iter(resolve, reject) {

    this.keys.next().then(
      function (k) {
        resolve(this.object[k]);
      }.bind(this)
    ).then(undefined, reject);

    return undefined;

  };

  function ObjectValuesIterable(obj) {

    Iterable.call(this);
    this.object = obj;

  }
  util.inherits(ObjectValuesIterable, Iterable);

  ObjectValuesIterable.prototype.iterator = function iterator() {

    return new ObjectValuesIterator(this.object);

  };

  function ObjectIterable(obj) {

    Iterable.call(this);
    this.object = obj;

  }
  util.inherits(ObjectIterable, Iterable);

  ObjectIterable.prototype.keys = function keys() {

    return new ObjectKeysIterable(this.object);

  };
  ObjectIterable.prototype.values = function values() {

    return new ObjectValuesIterable(this.object);

  };

  ObjectIterable.prototype.iterator = function iterator() {

    return this.keys().iterator();

  };

  return ObjectIterable;

}());
