/*jslint node: true, indent: 2, passfail: true, continue: true */

module.exports = (function () {
  "use strict";

  var Iterator = require('../itertools/core/iterator'),
    Iterable = require('../itertools/core/iterable'),
    StopIterationError = require('../itertools/core/stopiteration'),
    util = require('util');

  function AsyncCounter(start, limit) {
    Iterator.call(this);
    Iterable.call(this);
    this.start = start || 0;
    this.limit = limit || 10;
    this.count = start - 1;
  }
  util.inherits(AsyncCounter, Iterator);

  AsyncCounter.prototype.iter = function iter(resolve, reject) {

    this.count = this.count + 1;
    if (this.count >= this.limit) {
      reject(new StopIterationError());
    }

    setTimeout(
      resolve.bind(undefined, this.count),
      Math.random()
    );

  };

  AsyncCounter.prototype.iterator = function iterator() {

    return new AsyncCounter(this.start, this.limit);

  };

  return AsyncCounter;

}());
