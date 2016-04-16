
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

- `MostLikely::new(itemCount?: Number = 1000000, errorRate?: Number = 0.005, mask?: Boolean = true, counter?: Boolean = true): MostLikely`:<br/>
  Creates a new MostLikely set, intended for an expected number of
  `itemCount` items, an expected "false positive" error rate `errorRate`
  and internally using a `mask`-based bit-field and/or a `counter`-based
  bit-field.

- `MostLikely::export(type?: String = "rle+z85"): Object`:<br/>
  Export the MostLikely set into a JSON-encodable object.

- `MostLikely::import(obj: Object, type?: String = "rle+z85"): MostLikely`:<br/>
  Import the MostLikely set from a (previously exported) JSON-encodable object.

- `MostLikely::format(type?: String = "rle+z85"): String`:<br/>
  Format the MostLikely set into a network transmitable string representation.

- `MostLikely::parse(str: String, type?: String = "rle+z85"): MostLikely`:<br/>
  Parse the MostLikely set from a (previously formatted) network transmitable string representation.

- `MostLikely::insert(data: any[], size?: Number = data.length): MostLikely`:<br/>
  Insert an element into the MostLikely set. The element has to be an
  `Array`-like data structure (usually either a real `Array`, a typed
  array like `Uint8Array` or a `String`).

- `MostLikely::remove(data: any[], size?: Number = data.length): MostLikely`:<br/>
  Remove an element from the MostLikely set. The element has to be an
  `Array`-like data structure (usually either a real `Array`, a typed
  array like `Uint8Array` or a `String`). This operation requires
  the MostLikely set to be instanciated with `counter` enabled.

- `MostLikely::contains(data: any[], size?: Number = data.length): Boolean`:<br/>
  Checks whether an element was inserted into the MostLikely set. The
  element has to be an `Array`-like data structure (usually either a
  real `Array`, a typed array like `Uint8Array` or a `String`). If
  this function returns `false`, you can be 100% sure the element was
  not inserted into the set. If this function returns `true` it is
  most-likely the element was inserted into the set, but it can be also
  a false positive (expected to happen only with a probability of the
  configured `errorRate`). In other words: on `errorRate=0.005` you have
  to expect that this function returns `true` in 5% of all cases even
  for elements which were NOT inserted into the set.

- `MostLikely::clear(): MostLikely`:<br/>
  Removes all previously inserted elements from the MostLikely set.

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

