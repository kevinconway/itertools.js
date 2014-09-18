/*jslint node: true, indent: 2, passfail: true */
/*global require, define, module, describe, it, xit */

"use strict";

var expect = require('expect.js'),
  Iterator = require('../itertools/core/iterator'),
  ArrayIter = require('../itertools/core/arrayiter'),
  forEachIter = require('../itertools/core/foreach'),
  Compress = require('../itertools/iterables/compress'),
  TestIter = require('./testiter');

describe("The Compress iterable", function () {

  it("only produces items that have corresponding truthy value", function (done) {

    this.timeout(5000);

    var values = new TestIter(1, 10),
    // var values = [1, 2, 3, 4, 5, 6, 7, 8, 9],
      tests = [0, 1, 0, 1, 0, 1, 0, 1, 0],
      iter = new Compress(values, tests);

    forEachIter(iter.iterator(), function (item) {
      expect(item % 2).to.be(0);
    }).then(done, done);

  });

});
