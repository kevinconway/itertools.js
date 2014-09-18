/*jslint node: true, indent: 2, passfail: true */
/*global require, define, module, describe, it, xit */

"use strict";

var expect = require('expect.js'),
  Iterator = require('../itertools/core/iterator'),
  ArrayIter = require('../itertools/core/arrayiter'),
  forEachIter = require('../itertools/core/foreach'),
  Slice = require('../itertools/iterables/slice'),
  StopIterationError = require('../itertools/core/stopiteration'),
  TestIter = require('./testiter');

describe("The Slice iterable", function () {

  it("starts at the given offset", function (done) {

    var values = new TestIter(0, 10),
      iter = new Slice(values, 4).iterator();

    iter.next().then(function (v) {
      expect(v).to.be(4);
    }).then(iter.next.bind(iter)).then(function (v) {
      expect(v).to.be(5);
    }).then(done, done);

  });

  it("stops at the given offset", function (done) {

    var values = new TestIter(0, 10),
      iter = new Slice(values, 4, 4).iterator();

    iter.next().then(function (v) {
      expect(v).to.be(4);
    }).then(iter.next.bind(iter)).then(undefined, function (err) {
      expect(err instanceof StopIterationError).to.be(true);
    }).then(done, done);

  });

  it("increments using the given step", function (done) {

    var values = new TestIter(0, 10),
      iter = new Slice(values, 4, undefined, 2).iterator();

    iter.next().then(function (v) {
      expect(v).to.be(4);
    }).then(iter.next.bind(iter)).then(function (v) {
      expect(v).to.be(6);
    }).then(done, done);

  });

});
