/*jslint node: true, indent: 2, nomen: true, passfail: true */
/*global require, define, module, describe, it, xit */

"use strict";

var path = require('path'),
  expect = require('expect.js'),
  forEachIter = require('../itertools/core/foreach'),
  File = require('../itertools/iterables/file');

describe("The File iterable", function () {

  it("produces lines one at a time", function (done) {

    var f = new File(path.join(__dirname, 'testfile.txt')),
      it = f.iterator(),
      lines = [
        "this is a test\n",
        "this is only a test\n",
        "\n",
        "did it pass?\n"
      ],
      state = {"count": 0};

    forEachIter(it, function (line) {
      expect(line).to.be(lines[state.count]);
      state.count = state.count + 1;
    }).then(done, done);

  });

});
