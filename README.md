
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

MostLikely is a library for JavaScript (for use in the Node and Browser
environment), providing a space-efficient probabilistic data structure
that can be used to test whether an element is a member of a set. False
positive matches are possible, but false negatives are not, i.e., a
query returns either "possibly in set" (within a configured error rate)
or "definitely not in set" (with a 100% accuracy).

Internally, MostLikely is based on a [Bloom
Filter](https://en.wikipedia.org/wiki/Bloom_filter), which in turn is
based on multiple non-cryptographically hash functions and a bit-field.
The distinct features of MostLikely (compared to standard Bloom Filter
implementations) are:

- optionally supports element removal operation through a counting Bloom filter variant,
- derives its required hash functions from a full set of distinct hash functions (MurmurHash3, Jenkins, CRC32, DJBX33X and FNV),
- supports exporting/importing through Run-Length Encoding (RLE) compression and Base16/Z85 encoding,
- is a standalone/dependency-free implementation and
- supports both Node and Browser run-time environments.

Application Programming Interface
---------------------------------

MostLikely provides the following API:

- `MostLikely::new(itemCount?: Number, errorRate?: Number, mask?: Boolean, counter?: Boolean): MostLikely`

- `MostLikely::export(type?: String): Object`

- `MostLikely::import(obj: Object, type?: String): MostLikely`

- `MostLikely::format(type): String`

- `MostLikely::parse(str: String, type?: String): MostLikely`

- `MostLikely::insert(data: any[], size?: Number): MostLikely`

- `MostLikely::remove(data: any[], size?: Number): MostLikely`

- `MostLikely::contains(data: any[], size?: Number): Boolean`

- `MostLikely::clear(): MostLikely`

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

