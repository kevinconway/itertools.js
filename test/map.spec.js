/*jslint node: true, indent: 2, passfail: true */
/*global require, define, module, describe, it, xit */

"use strict";

var expect = require('expect.js'),
  Iterator = require('../itertools/core/iterator'),
  ArrayIter = require('../itertools/core/arrayiter'),
  forEachIter = require('../itertools/core/foreach'),
  Map = require('../itertools/iterables/map'),
  TestIter = require('./testiter');

describe("The Map iterable", function () {

  it("produces the results of fn applied to each item", function (done) {

    var values = new TestIter(1, 10),
      fn = function (v) { return v * 2; },
      iter = new Map(fn, values).iterator();

    iter.next().then(function (v) {
      expect(v).to.be(2);
    }).then(iter.next.bind(iter)).then(function (v) {
      expect(v).to.be(4);
    }).then(iter.next.bind(iter)).then(function (v) {
      expect(v).to.be(6);
    }).then(iter.next.bind(iter)).then(function (v) {
      expect(v).to.be(8);
    }).then(done, done);

  });

});
