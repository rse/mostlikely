/*
**  MostLikely -- Most-Likely Classification Through Bloom-Filtering
**  Copyright (c) 2016-2018 Ralf S. Engelschall <rse@engelschall.com>
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

/*  This is Fowler–Noll–Vo (FNV-1a 32-bit), a non-cryptographic hash
    function suitable for general hash-based lookup developed by Glenn
    Fowler, Landon Curt Noll and Phong Vo. The basis of the hash
    algorithm was taken from an idea sent by Email to the IEEE Posix
    P1003.2 mailing list from Phong Vo <kpv@research.att.com> and Glenn
    Fowler <gsf@research.att.com>. Landon Curt Noll <chongo@toad.com>
    later improved on their algorithm. The magic is in the interesting
    relationship between the special prime 16777619 (2^24 + 403) and
    2^32 and 2^8. This hash produces only very few collisions for real
    world keys and works well on both numbers and strings. It is not one
    of the fastest hashes. See http://isthe.com/chongo/tech/comp/fnv/
    for details. */

module.exports = function FNV (data, size = data.length, seed = 1) {
    let hash = 0x811C9DC5 * seed
    for (let i = 0; i < size; i++) {
        hash = hash ^ data[i]
        /*  operation: hash = hash * FNV_Prime
            32-bit FNV_Prime: 2**24 + 2**8 + 0x93  */
        hash += (hash << 24) + (hash << 8) + (hash << 7) + (hash << 4) + (hash << 1)
    }
    return (hash & 0xFFFFFFFF) >>> 0
}

