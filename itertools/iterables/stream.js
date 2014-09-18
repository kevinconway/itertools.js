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
    BufferedNext = require('../core/bufferednext'),
    BufferedIter = require('../core/bufferediter'),
    Iterable = require('../core/iterable');

  function StreamConsumer(stream, thisArg) {

    return function consumeFromStream() {

      var value = stream.read();
      thisArg.push(value);

    };

  }

  function ReadyWaiter(deferred, thisArg) {
    return function waitForReady() {

      if (thisArg.ready() || thisArg.shouldStop()) {
        deferred.resolve();
      }

    };
  }

  function StreamIterator(readable, idleTime) {

    BufferedNext.call(this);
    BufferedIter.call(this);
    this.stream = readable;
    this.idleTime = idleTime || 100;

    this.stream.on('readable', new StreamConsumer(this.stream, this));
    this.stream.on('end', this.stop.bind(this));

  }
  modelo.inherits(StreamIterator, Iterable, BufferedNext, BufferedIter);

  StreamIterator.prototype.iterator = function iterator() {

    return this;

  };

  StreamIterator.prototype.read = function read() {

    var d = new Deferred(),
      intervalHandler;

    intervalHandler = setInterval(
      new ReadyWaiter(d, this),
      this.idleTime
    );

    return d.promise().then(function () {
      intervalHandler.clearInterval();
    });

  };

  return StreamIterator;

}());
