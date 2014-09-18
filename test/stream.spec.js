/*jslint node: true, indent: 2, nomen: true, passfail: true */
/*global require, define, module, describe, it, xit */

"use strict";

var path = require('path'),
  util = require('util'),
  expect = require('expect.js'),
  forEachIter = require('../itertools/core/foreach'),
  Stream = require('../itertools/iterables/stream'),
  nodestream = require('stream');

function TestStream() {

  nodestream.Readable.call(this);
  this.count = 0;

}
util.inherits(TestStream, nodestream.Readable);
TestStream.prototype._read = function _read() {

  if (this.count > 9) {
    this.push(null);
    return undefined;
  }
  this.push(this.count.toString());
  this.count = this.count + 1;

};


describe("The Stream iterable", function () {

  it("converts readable streams into iterables", function (done) {

    var f = new Stream(new TestStream()),
      it = f.iterator(),
      state = {"message": ""};

    forEachIter(it, function (item) {
      state.message = state.message + item.toString();
    }).then(function () {
      expect(state.message).to.be("0123456789");
    }).then(done, done);

  });

});
