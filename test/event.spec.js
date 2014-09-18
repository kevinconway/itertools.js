/*jslint node: true, indent: 2, nomen: true, passfail: true */
/*global require, define, module, describe, it, xit */

"use strict";

var path = require('path'),
  expect = require('expect.js'),
  forEachIter = require('../itertools/core/foreach'),
  EventEmitter = require('events').EventEmitter,
  EventIterable = require('../itertools/iterables/event');

describe("The Event iterable", function () {

  it("buffers events when not iterating", function (done) {

    var e = new EventEmitter(),
      f = new EventIterable(e, 'test'),
      it = f.iterator(),
      state = { "count": 0 };

    e.emit('test', true, false);
    e.emit('test', true, false);
    e.emit('test', true, false);
    it.stop();

    forEachIter(it, function (v1, v2) {
      expect(v1).to.be(true);
      expect(v2).to.be(false);
      state.count = state.count + 1;
    }).then(function () {
      expect(state.count).to.be(3);
    }).then(done, done);

  });

});
