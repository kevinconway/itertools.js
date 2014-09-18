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

  var modelo = require('modelo'),
    Deferred = require('deferredjs').Deferred,
    args = require('../../helper/args'),
    BufferedNext = require('../core/bufferednext'),
    BufferedIter = require('../core/bufferediter'),
    Iterable = require('../core/iterable'),
    StopIterationError = require('../core/stopiteration');

  function listen() {

    this.push(args.apply(undefined, arguments));

  }

  function EventIterator(emitter, eventName) {

    BufferedNext.call(this);
    BufferedIter.call(this);
    this.emitter = emitter;
    this.eventName = eventName;
    this.listener = listen.bind(this);

    this.emitter.on(this.eventName, this.listener);

  }
  modelo.inherits(EventIterator, BufferedNext, BufferedIter);

  EventIterator.prototype.stop = function stop() {
    BufferedIter.prototype.stop.call(this);
    this.emitter.removeListener(this.eventName, this.listener);
  };

  EventIterator.prototype.read = function read() {

    var p = new Deferred();
    this.emitter.once(this.eventName, function () {
      p.resolve();
    });

    return p.promise();

  };

  EventIterator.prototype.iter = function iter(resolve, reject) {

    if (this.shouldStop() && !this.ready()) {
      reject(new StopIterationError());
      return undefined;
    }

    if (this.ready()) {
      resolve.apply(undefined, this.shift());
      return undefined;
    }

    this.read().then(this.iter.bind(this, resolve, reject), reject);

  };

  function EventIterable(emitter, eventName) {

    Iterable.call(this);
    this.emitter = emitter;
    this.eventName = eventName;

  }
  modelo.inherits(EventIterable, Iterable);

  EventIterable.prototype.iterator = function iterator() {

    return new EventIterator(this.emitter, this.eventName);

  };

  return EventIterable;

}());
