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

/*jslint node: true, indent: 2, passfail: true */
/*global Chain, Slice, Filter, Map*/

module.exports = (function () {
  "use strict";

  var modelo = require('modelo'),
    Iterable = require('./core/iterable'),
    Iterator = require('./core/iterator'),
    callbackHelper = require('../helper/callback'),
    args = require('../helper/args'),
    forEachIter = require('./core/foreach'),
    ChainIterable = require('./iterables/chain'),
    CompressIterable = require('./iterables/compress'),
    CountIterable = require('./iterables/count'),
    CycleIterable = require('./iterables/cycle'),
    DropWhileIterable = require('./iterables/dropwhile'),
    FileIterable = require('./iterables/file'),
    FilterIterable = require('./iterables/filter'),
    FilterFalseIterable = require('./iterables/filterfalse'),
    MapIterable = require('./iterables/map'),
    RepeatIterable = require('./iterables/repeat'),
    SliceIterable = require('./iterables/slice'),
    StreamIterable = require('./iterables/stream'),
    TakeWhileIterable = require('./iterables/takewhile');

  function ExtendedIterable() {
    Iterable.apply(this, arguments);
  }
  modelo.inherits(ExtendedIterable, Iterable);

  ExtendedIterable.prototype.toArray = function toArray(callback) {

    var helper = callbackHelper.call(undefined, callback),
      response = [];

    forEachIter(this.iterator(), response.push.bind(response)).then(
      function () { helper.resolve(response); },
      helper.reject
    );

    return helper.response;

  };

  ExtendedIterable.prototype.concat = function concat() {

    var i = Object.create(Chain.prototype);
    Chain.apply(i, [this].concat(args.appl(undefined, arguments)));
    return i;

  };

  ExtendedIterable.prototype.join = function join(seperator, callback) {

    var helper = callbackHelper.call(undefined, callback);

    this.toArray().then(function (r, v) {
      r(v.join(seperator));
    }.bind(undefined, helper.resolve), helper.reject);

    return helper.response;

  };

  ExtendedIterable.prototype.slice = function slice(start, stop, step) {

    return new Slice(this.iterator(), start, stop, step);

  };

  ExtendedIterable.prototype.forEach = function forEach(fn, thisArg, callback) {

    var helper = callbackHelper.call(undefined, callback);

    forEachIter(this.iterator(), fn.bind(thisArg)).then(
      helper.resolve,
      helper.reject
    );

    return helper.response;

  };

  ExtendedIterable.prototype.every = function every(test, thisArg, callback) {

    var helper = callbackHelper.call(undefined, callback);

    this.toArray().then(
      function (arr) { return arr.every(test, thisArg); }
    ).then(
      helper.resolve,
      helper.reject
    );

    return helper.response;

  };

  ExtendedIterable.prototype.some = function some(test, thisArg, callback) {

    var helper = callbackHelper.call(undefined, callback);

    this.toArray().then(
      function (arr) { return arr.some(test, thisArg); }
    ).then(
      helper.resolve,
      helper.reject
    );

    return helper.response;

  };

  ExtendedIterable.prototype.filter = function filter(test, thisArg) {

    return new Filter(test.bind(thisArg), this.iterator());

  };

  ExtendedIterable.prototype.map = function map(fn, thisArg) {

    return new Map(fn.bind(thisArg), this.iterator());

  };

  function Chain() {
    ExtendedIterable.call(this);
    ChainIterable.apply(this, arguments);
  }
  modelo.inherits(Chain, ExtendedIterable, ChainIterable);

  function Compress() {
    ExtendedIterable.call(this);
    CompressIterable.apply(this, arguments);
  }
  modelo.inherits(Compress, ExtendedIterable, CompressIterable);

  function Count() {
    ExtendedIterable.call(this);
    CountIterable.apply(this, arguments);
  }
  modelo.inherits(Count, ExtendedIterable, CountIterable);

  function Cycle() {
    ExtendedIterable.call(this);
    CycleIterable.apply(this, arguments);
  }
  modelo.inherits(Cycle, ExtendedIterable, CycleIterable);

  function DropWhile() {
    ExtendedIterable.call(this);
    DropWhileIterable.apply(this, arguments);
  }
  modelo.inherits(DropWhile, ExtendedIterable, DropWhileIterable);

  function File() {
    ExtendedIterable.call(this);
    FileIterable.apply(this, arguments);
  }
  modelo.inherits(File, ExtendedIterable, FileIterable);

  function Filter() {
    ExtendedIterable.call(this);
    FilterIterable.apply(this, arguments);
  }
  modelo.inherits(Filter, ExtendedIterable, FilterIterable);

  function FilterFalse() {
    ExtendedIterable.call(this);
    FilterFalseIterable.apply(this, arguments);
  }
  modelo.inherits(FilterFalse, ExtendedIterable, FilterFalseIterable);

  function Map() {
    ExtendedIterable.call(this);
    MapIterable.apply(this, arguments);
  }
  modelo.inherits(Map, ExtendedIterable, MapIterable);

  function Repeat() {
    ExtendedIterable.call(this);
    RepeatIterable.apply(this, arguments);
  }
  modelo.inherits(Repeat, ExtendedIterable, RepeatIterable);

  function Slice() {
    ExtendedIterable.call(this);
    SliceIterable.apply(this, arguments);
  }
  modelo.inherits(Slice, ExtendedIterable, SliceIterable);

  function Stream() {
    ExtendedIterable.call(this);
    StreamIterable.apply(this, arguments);
  }
  modelo.inherits(Stream, ExtendedIterable, StreamIterable);

  function TakeWhile() {
    ExtendedIterable.call(this);
    TakeWhileIterable.apply(this, arguments);
  }
  modelo.inherits(TakeWhile, ExtendedIterable, TakeWhileIterable);

  return {
    "Chain": Chain,
    "Compress": Compress,
    "Count": Count,
    "Cycle": Cycle,
    "DropWhile": DropWhile,
    "File": File,
    "Filter": Filter,
    "FilterFalse": FilterFalse,
    "Map": Map,
    "Repeat": Repeat,
    "Slice": Slice,
    "Stream": Stream,
    "TakeWhile": TakeWhile,
    "Iterable": ExtendedIterable,
    "Iterator": Iterator
  };

}());
