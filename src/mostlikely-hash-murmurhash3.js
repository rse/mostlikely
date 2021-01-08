/*
**  MostLikely -- Most-Likely Classification Through Bloom-Filtering
**  Copyright (c) 2016-2021 Dr. Ralf S. Engelschall <rse@engelschall.com>
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

/*  This is MurmurHash3, a non-cryptographic hash function suitable for
    general hash-based lookup. See
    https://en.wikipedia.org/wiki/MurmurHash for details. The difference
    of this version against the original hash function is just the seed
    argument to support Bloom filters.  */

const mul32  = (a, b) => (a & 0xffff) * b + (((a >>> 16) * b & 0xffff) << 16) & 0xffffffff
const sum32  = (a, b) => (a & 0xffff) + (b >>> 16) + (((a >>> 16) + b & 0xffff) << 16) & 0xffffffff
const rotl32 = (a, b) => (a << b) | (a >>> (32 - b))

module.exports = function MurmurHash3 (data, size = data.length, seed = 1) {
    let c1 = 0xcc9e2d51
    let c2 = 0x1b873593
    let r1 = 15
    let r2 = 13
    let m  = 5
    let n  = 0x6b64e654

    let hash = 0xFBA4C795 * seed

    let k1
    let i
    for (i = 0; i + 4 <= size; i += 4) {
        k1 = data[i] |
            (data[i + 1] <<  8) |
            (data[i + 2] << 16) |
            (data[i + 3] << 24)
        k1 = mul32 (k1, c1)
        k1 = rotl32(k1, r1)
        k1 = mul32 (k1, c2)
        hash ^= k1;
        hash = rotl32(hash, r2)
        hash = mul32 (hash, m)
        hash = sum32 (hash, n)
    }

    k1 = 0
    switch (size & 3) {
        case 3:
            k1 ^= data[i + 2] << 16
            /* falls through */
        case 2:
            k1 ^= data[i + 1] << 8
            /* falls through */
        case 1:
            k1 ^= data[i];
            k1 = mul32 (k1, c1)
            k1 = rotl32(k1, r1)
            k1 = mul32 (k1, c2)
            hash ^= k1
    }

    hash ^= size
    hash ^= hash >>> 16
    hash = mul32(hash, 0x85ebca6b)
    hash ^= hash >>> 13
    hash = mul32(hash, 0xc2b2ae35)
    hash ^= hash >>> 16

    return hash >>> 0
}

