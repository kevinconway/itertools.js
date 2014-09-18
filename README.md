# Itertools.js [![Current Build Status](https://travis-ci.org/kevinconway/itertools.js.png?branch=master)](https://travis-ci.org/kevinconway/itertools.js)

*Async iterators*

## What

Itertools has two main components. One is the iterable/iterator interface that
can be implemented to support iterator over any async resource. The other is a
set of utilities which consume that interface to provide some useful iterations.

Think of itertools like generators, only without the need for ECMA6.

## The Interface

Creating an iterable is simple. Any JavaScript object which exposes a function
called `iterator` is an iterable. The `iterator` function must return
a valid iterator.

Any JavaScript object which exposes a `next` function is an iterator. The `next`
function takes an optional callback as the last argument. If a callback is
provided the function must call it with an error or value just like any other
callback. If no callback is given the function must return an A+ complian
promise which resolves or rejects with the value or error respectively. When
an iterator is complete it should reject with a StopIterationError which is
provided by this package.

## Quick Example

There is a file iterable built into the itertools library that allows you to
iterate over the lines of a file.

```javascript
    var File = require('itertoolsjs').File,
        filePath = 'grimms_fairy_tales.txt',
        fileIterable = new File(filePath),
        iterator;

    // Manually using the interface.
    iterator = fileIterable.iterator();
    iterator.next().then(console.log); // Can get a promise if desired.
    iterator.next(console.log); // Can use a callback if desired.
    iterator.next().then(console.log);
    iterator.next().then(console.log);
    // As the bytes stream in from the file...
    // THE GOLDEN BIRD
    //
    // A certain king had a beautiful garden, and in the garden stood a tree
    // which bore golden apples. These apples were always counted, and about

    // Using the built-in operations
    var lines = { "count": 0 };
    fileIterable.filter(function (line) {
        return line.indexOf('the') >= 0;
    }).forEach(function () {
        lines.count += 1;
    }).then(function () {
        console.log(lines);
    });
    // Once the file is process...
    // { count: 5568 }
```

## Iterable Sources

While any source can be implemented as an iterable, this package comes with some
built in that may be of use.

-   File => Iterate over lines of a file.
-   Event => Iterate over events emitted by an EventEmitter.
-   Stream => Iterate of values emitted by a ReadableStream.
-   Count => Iterate over a generated series of numbers.
-   Repeat => Iterate over the same value some number of times.

## Iterable Modifiers

Iterables don't need to pull from only from a remote resource like a file. Many
simply consume other iterables and apply some modification. These are some
useful built in modifiers.

-   Chain => Combine any number of iterables into one.
-   Cycle => Repeat the values from an iterable forever.
-   Filter => Only produce values from an iterable that pass a boolean test.
-   Map => Apply a function to each value in an iterable and produce the results.
-   Slice => Only produce values from an iterable within a given window.

There are more modifiers. These are simply the most commonly used.

## Docs

More docs on the way.

## Setup

### Node.js

This package is published through NPM under the name 'itertoolsjs':

    $ npm install itertoolsjs

Once installed, simply ```itertools = require("itertoolsjs")```.

### Browser

This module uses browserify to create a browser compatible module. The default
grunt workflow for this project will generate both a full and minified browser
script in a build directory which can be included as a ```<script>``` tag:

    <script src="itertools.browser.min.js"></script>

The package is exposed via the global name 'itertoolsjs'.

### Tests

Running the `npm test` command will kick off the default grunt workflow. This
will lint using jslint, run the mocha/expect tests, generate a browser module,
and run the community specification tests.

## License

This project is released and distributed under an MIT License.

    Copyright (C) 2014 Kevin Conway

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    DEALINGS IN THE SOFTWARE.

## Contributors

### Style Guide

All code must validate against JSlint.

### Testing

Mocha plus expect. All tests and functionality must run in Node.js and the
browser.

### Contributor's Agreement

All contribution to this project are protected by the contributors agreement
detailed in the CONTRIBUTING file. All contributors should read the file before
contributing, but as a summary:

    You give us the rights to distribute your code and we promise to maintain
    an open source release of anything you contribute.
