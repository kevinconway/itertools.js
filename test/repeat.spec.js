/*jslint node: true, indent: 2, passfail: true */
/*global require, define, module, describe, it, xit */

"use strict";

var expect = require('expect.js'),
  Iterator = require('../itertools/core/iterator'),
  ArrayIter = require('../itertools/core/arrayiter'),
  forEachIter = require('../itertools/core/foreach'),
  Repeat = require('../itertools/iterables/repeat'),
  TestIter = require('./testiter');

describe("The Repeat iterable", function () {

  it("repeats a given value", function (done) {

    var iter = new Repeat(true).iterator();

    iter.next().then(function (v) {
      expect(v).to.be(true);
    }).then(iter.next.bind(iter)).then(function (v) {
      expect(v).to.be(true);
    }).then(done, done);

  });

  it("repeats a given number of times", function (done) {

    var iter = new Repeat(false, 2),
      count = { "value": 0};

    forEachIter(iter.iterator(), function (v) {
      expect(v).to.be(false);
      count.value = count.value + 1;
    }).then(function () {
      expect(count.value).to.be(2);
    }).then(done, done);

  });

});
