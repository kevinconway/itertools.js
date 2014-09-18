/*
The MIT License (MIT)
Copyright (c) 2014 Kevin Conway

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*jslint node: true, indent: 2, passfail: true */

module.exports = (function () {
  "use strict";

  var modelo = require('modelo'),
    fs = require('fs'),
    os = require('os'),
    loop = require('loopjs'),
    when = require('deferredjs').when,
    convert = require('deferredjs').convert,
    open = convert(fs.open),
    close = convert(fs.close),
    readFromFile = convert(fs.read),
    BufferedNext = require('../core/bufferednext'),
    BufferedIter = require('../core/bufferediter'),
    Iterable = require('../core/iterable');

  function FileIterator(filename, chunkSize, encoding) {

    BufferedNext.call(this);
    BufferedIter.call(this);
    this.filename = filename;
    this.chunkSize = chunkSize || 8192;
    this.encoding = encoding || 'utf8';
    this.buffer = new Buffer(this.chunkSize);
    this.fragment = undefined;
    this.fd = undefined;

  }
  modelo.inherits(FileIterator, BufferedNext, BufferedIter);

  FileIterator.prototype.read = function read() {

    var p = when();

    if (this.fd === undefined) {
      p = this.openFile();
    }

    p = p.then(loop.until.true.bind(
      undefined,
      this.ready.bind(this),
      this.readChunk.bind(this),
      true
    ));

    return p;

  };

  FileIterator.prototype.readChunk = function readChunk() {

    var p = readFromFile(this.fd, this.buffer, 0, this.chunkSize, null);
    p = p.then(function handleRead(bytesRead, buffer) {

      if (bytesRead < this.chunkSize) {
        this.stop();
        this.closeFile();
      }

      return buffer.toString(this.encoding, 0, bytesRead);

    }.bind(this));

    p = p.then(function (str) {

      this.fragment = this.fragment || "";
      var eol = str.indexOf(os.EOL);

      if (eol < 0) {
        this.fragment = this.fragment + str;
        return undefined;
      }

      this.push(this.fragment + str.slice(0, eol + 1));
      this.fragment = "";
      str = str.slice(eol + 1);
      eol = str.indexOf(os.EOL);

      while (eol > -1) {

        this.push(str.slice(0, eol + 1));
        str = str.slice(eol + 1);
        eol = str.indexOf(os.EOL);

      }

      this.fragment = str;

    }.bind(this));

    return p;

  };

  FileIterator.prototype.openFile = function openFile() {
    return open(this.filename, 'r').then(function (fd) {
      this.fd = fd;
    }.bind(this));
  };
  FileIterator.prototype.closeFile = function closeFile() {
    return close(this.fd);
  };

  function FileIterable(filename, chunkSize, encoding) {

    Iterable.call(this);
    this.filename = filename;
    this.chunkSize = chunkSize || 8192;
    this.encoding = encoding || 'utf8';

  }
  modelo.inherits(FileIterable, Iterable);

  FileIterable.prototype.iterator = function iterator() {

    return new FileIterator(this.filename, this.chunkSize, this.encoding);

  };

  return FileIterable;

}());
