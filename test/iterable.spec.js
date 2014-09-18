/*jslint node: true, indent: 2, passfail: true */
/*global require, define, module, describe, it, xit */

"use strict";

var expect = require('expect.js'),
  ArrayIter = require('../itertools/core/arrayiter'),
  ObjectIter = require('../itertools/core/objectiter'),
  forEachIter = require('../itertools/core/foreach');

describe("The Array iterable object", function () {

  it("converts an array into an iterable", function (done) {

    var original = [1, 2, 3, 4, 5],
      iter = new ArrayIter(original),
      count = { "value": 0 };

    function test(value) {
      expect(value).to.be(original[count.value]);
      count.value = count.value + 1;
    }

    forEachIter(iter.iterator(), test).then(done, done);

  });

  it("can produce multiple iterators for one array", function (done) {

    var original = [1, 2, 3, 4, 5],
      iter = new ArrayIter(original),
      count = { "value": 0 };

    function test(value) {
      expect(value).to.be(original[count.value]);
      count.value = count.value + 1;
    }

    function runTest() {
      count.value = 0;
      return forEachIter(iter.iterator(), test);
    }

    runTest().then(runTest).then(runTest).then(done, done);

  });

});

describe("The Object iterable object", function () {

  it("produces a keys iterable", function (done) {

    var original = {"test1": true, "test2": true, "test3": true},
      iter = new ObjectIter(original);

    forEachIter(iter.keys().iterator(), function (key) {
      expect(original[key]).to.be(true);
    }).then(done, done);

  });

  it("produces a values iterable", function (done) {

    var original = {"test1": false, "test2": false, "test3": false},
      iter = new ObjectIter(original);

    forEachIter(iter.values().iterator(), function (value) {
      expect(value).to.be(false);
    }).then(done, done);

  });

});
