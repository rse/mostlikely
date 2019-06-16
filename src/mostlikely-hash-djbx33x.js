/*
**  MostLikely -- Most-Likely Classification Through Bloom-Filtering
**  Copyright (c) 2016-2019 Dr. Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*  Daniel J. Bernstein's Times-33-XOR (DJBX33X) hash function (in
    an unrolled variant). It basically uses a function like "hash(i)
    = hash(i-1) * 33 + data[i]". This is one of the best known hash
    functions for strings. Because it is both computed very fast and
    distributes very well. The magic of number 33, i.e. why it works
    better than many other constants, prime or not, has never been
    adequately explained by anyone, but if one experimentally tests
    all multipliers between 1 and 256 one detects that even numbers
    are not useable at all and the remaining 128 odd numbers (except
    for the number 1) work more or less all equally well. They all
    distribute in an acceptable way and this way fill a hash table with
    an average percent of approx. 86%. But the advantage of 33 is that
    it be computed with a shift and an addition! The difference of this
    version against the original hash function is just the seed argument
    to support Bloom filters.  */

module.exports = function DJBX33X (data, size = data.size, seed = 1) {
    let hash = 5381 * seed
    let i = 0
    for (; size >= 8; size -= 8) {
        hash = ((hash << 5) + hash) ^ data[i++]
        hash = ((hash << 5) + hash) ^ data[i++]
        hash = ((hash << 5) + hash) ^ data[i++]
        hash = ((hash << 5) + hash) ^ data[i++]
        hash = ((hash << 5) + hash) ^ data[i++]
        hash = ((hash << 5) + hash) ^ data[i++]
        hash = ((hash << 5) + hash) ^ data[i++]
        hash = ((hash << 5) + hash) ^ data[i++]
    }
    switch (size) {
        case 7: hash = ((hash << 5) + hash) ^ data[i++] /* falls through */
        case 6: hash = ((hash << 5) + hash) ^ data[i++] /* falls through */
        case 5: hash = ((hash << 5) + hash) ^ data[i++] /* falls through */
        case 4: hash = ((hash << 5) + hash) ^ data[i++] /* falls through */
        case 3: hash = ((hash << 5) + hash) ^ data[i++] /* falls through */
        case 2: hash = ((hash << 5) + hash) ^ data[i++] /* falls through */
        case 1: hash = ((hash << 5) + hash) ^ data[i++]; break
        default: /* case 0: */ break
    }
    return (hash & 0xFFFFFFFF) >>> 0
}

