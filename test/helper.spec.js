/*jslint node: true, indent: 2, passfail: true */
/*global require, define, module, describe, it, xit */

"use strict";

var expect = require('expect.js'),
  args = require('../helper/args.js'),
  callbackHelper = require('../helper/callback.js'),
  forEachIter = require('../itertools/core/foreach.js'),
  StopIterationError = require('../itertools/core/stopiteration.js');

describe("The arguments helper module", function () {

  it("converts arguments objects into arrays", function () {

    var result = args.call(undefined, true, false, null, 0);

    expect(result.length).to.be(4);
    expect(result[0]).to.be(true);
    expect(result[1]).to.be(false);
    expect(result[2]).to.be(null);
    expect(result[3]).to.be(0);

  });

});

describe("The callbackHelper module", function () {

  it("passes the value to a callback on success", function (done) {

    function test(done, err, value) {
      expect(err).to.be(undefined);
      expect(value).to.be(true);
      done();
    }

    var helper = callbackHelper(test.bind(undefined, done));

    helper.resolve(true);

  });

  it("passes the error to a callback on failure", function (done) {

    function test(done, err, value) {
      expect(err).to.be(true);
      expect(value).to.be(undefined);
      done();
    }

    var helper = callbackHelper(test.bind(undefined, done));

    helper.reject(true);

  });

  it("produces an empty response when a callback is given", function () {

    var helper = callbackHelper(function () { return null; });

    expect(helper.response).to.be(undefined);

  });

  it("produces an promise response when a callback is not given", function () {

    var helper = callbackHelper();

    expect(helper.response).to.be.ok();
    expect(helper.response.then).to.be.ok();
    expect(typeof helper.response.then).to.be('function');

  });

});

describe("The forEachIter helper module", function () {

  it("iterates over arbitrary iterable", function (done) {

    function next(callback) {
      var helper = callbackHelper(callback);
      if (this.count > 3) {
        helper.reject(new StopIterationError());
        return helper.response;
      }
      helper.resolve(this.count);
      this.count = this.count + 1;
      return helper.response;
    }

    var fakeIterable = {
      "count": 0,
      "testCount": 0
    };
    fakeIterable.next = next.bind(fakeIterable);

    function test(v) {

      expect(v).to.be(fakeIterable.testCount);
      fakeIterable.testCount = fakeIterable.testCount + 1;

    }

    forEachIter(fakeIterable, test).then(done, done);

  });

});
