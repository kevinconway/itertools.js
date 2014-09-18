/*jslint node: true, indent: 2, passfail: true */
/*global require, define, module, describe, it, xit */

"use strict";

var expect = require('expect.js'),
  Iterator = require('../itertools/core/iterator'),
  ArrayIter = require('../itertools/core/arrayiter'),
  forEachIter = require('../itertools/core/foreach'),
  Filter = require('../itertools/iterables/filter'),
  TestIter = require('./testiter');

describe("The Filter iterable", function () {

  it("produces all values that pass the test", function (done) {

    var values = new TestIter(1, 10),
      test = function (v) { return v > 5; },
      iter = new Filter(test, values).iterator();

    iter.next().then(function (v) {
      expect(v).to.be(6);
    }).then(iter.next.bind(iter)).then(function (v) {
      expect(v).to.be(7);
    }).then(iter.next.bind(iter)).then(function (v) {
      expect(v).to.be(8);
    }).then(iter.next.bind(iter)).then(function (v) {
      expect(v).to.be(9);
    }).then(done, done);

  });

});
