/*jslint node: true, indent: 2, passfail: true */
/*global require, define, module, describe, it, xit */

"use strict";

var expect = require('expect.js'),
  Iterator = require('../itertools/core/iterator'),
  ArrayIter = require('../itertools/core/arrayiter'),
  forEachIter = require('../itertools/core/foreach'),
  Chain = require('../itertools/iterables/chain'),
  TestIter = require('./testiter');

describe("The Chain iterable", function () {

  it("merges multiple iterator into a single one", function (done) {

    var a1 = new TestIter(1, 4),
      a2 = new TestIter(4, 7),
      a3 = new TestIter(7, 9),
      iter = new Chain(a1, a2, a3),
      counter = { "value": 1 };

    forEachIter(iter.iterator(), function (item) {
      expect(item).to.be(counter.value);
      counter.value = counter.value + 1;

    }).then(done, done);

  });

});
