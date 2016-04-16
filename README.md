
mostlikely
==========

Most-Likely Classification Through Bloom-Filtering

<p/>
<img src="https://nodei.co/npm/asty.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/asty.png" alt=""/>

Installation
------------

#### Node environments (with NPM package manager):

```shell
$ npm install mostlikely
```

#### Browser environments (with Bower package manager):

```shell
$ bower install mostlikely
```

About
-----

Data Structure library for JavaScript (for use in Node.js and the browser),...

FIXME

standalone/dependency-free
browser/node support
multiple hashes based
RLE-compressed B16/Z85 export/import
counter/mask support

Application Programming Interface
---------------------------------

MostLikely provides the following API:

FIXME

Implementation Notice
---------------------

Although MostLikely is written in ECMAScript 6, it is transpiled to
ECMAScript 5 and this way runs in really all(!) current (as of 2016)
JavaScript environments, of course.

Additionally, there are two transpilation results: first, there is
`mostlikely.browser.js` (plus `mostlikely.browser.map`) for Browser
environments. This is a size-compressed variant but still with
source-map for debugging. Second, there is `mostlikely.node.js` for
Node.js/IO.js environments. This is a variant without compression and no
source-maps.

License
-------

Copyright (c) 2016 Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

