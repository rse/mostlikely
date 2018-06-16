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

/*  This library provides Jenkins lookup3, a non-cryptographic
    hash function suitable for general hash-based lookup. See
    https://en.wikipedia.org/wiki/Jenkins_hash_function for details. The
    difference of this version against the original hash function is
    just the seed argument to support Bloom filters.  */

module.exports = function Jenkins (u8, size = u8.length, seed = 1) {
    let a = 0
    let b = 0
    let c = 0

    const rot = (x, k) =>
        ((x << k) | (x >>> (32 - k))) >>> 0

    const mix = () => {
        a = (a - c) >>> 0;  a ^= rot(c,  4); c = (c + b) >>> 0
        b = (b - a) >>> 0;  b ^= rot(a,  6); a = (a + c) >>> 0
        c = (c - b) >>> 0;  c ^= rot(b,  8); b = (b + a) >>> 0
        a = (a - c) >>> 0;  a ^= rot(c, 16); c = (c + b) >>> 0
        b = (b - a) >>> 0;  b ^= rot(a, 19); a = (a + c) >>> 0
        c = (c - b) >>> 0;  c ^= rot(b,  4); b = (b + a) >>> 0
    }

    const final = () => {
        c ^= b; c = (c - rot(b, 14)) >>> 0
        a ^= c; a = (a - rot(c, 11)) >>> 0
        b ^= a; b = (b - rot(a, 25)) >>> 0
        c ^= b; c = (c - rot(b, 16)) >>> 0
        a ^= c; a = (a - rot(c,  4)) >>> 0
        b ^= a; b = (b - rot(a, 14)) >>> 0
        c ^= b; c = (c - rot(b, 24)) >>> 0
    }

    a = b = c = (0xDEADBEEF + size + seed >>> 0) >>> 0

    let off = 0

    while (size > 12) {
        a = (a + u8[off + 0] + (u8[off + 1] << 8) + (u8[off +  2] << 16) + (u8[off +  3] << 24)) >>> 0
        b = (b + u8[off + 4] + (u8[off + 5] << 8) + (u8[off +  6] << 16) + (u8[off +  7] << 24)) >>> 0
        c = (c + u8[off + 8] + (u8[off + 9] << 8) + (u8[off + 10] << 16) + (u8[off + 11] << 24)) >>> 0
        mix()
        size   -= 12
        off += 12
    }

    switch (size) {
        case 12:
            c = (c + u8[off + 8] + (u8[off + 9] << 8) + (u8[off + 10] << 16) + (u8[off + 11] << 24)) >>> 0
            b = (b + u8[off + 4] + (u8[off + 5] << 8) + (u8[off +  6] << 16) + (u8[off +  7] << 24)) >>> 0
            a = (a + u8[off + 0] + (u8[off + 1] << 8) + (u8[off +  2] << 16) + (u8[off +  3] << 24)) >>> 0
            break
        case 11:
            c = (c + u8[off + 8] + (u8[off + 9] << 8) + (u8[off + 10] << 16)) >>> 0
            b = (b + u8[off + 4] + (u8[off + 5] << 8) + (u8[off +  6] << 16) + (u8[off + 7] << 24)) >>> 0
            a = (a + u8[off + 0] + (u8[off + 1] << 8) + (u8[off +  2] << 16) + (u8[off + 3] << 24)) >>> 0
            break
        case 10:
            c = (c + u8[off + 8] + (u8[off + 9] << 8)) >>> 0
            b = (b + u8[off + 4] + (u8[off + 5] << 8) + (u8[off + 6] << 16) + (u8[off + 7] << 24)) >>> 0
            a = (a + u8[off + 0] + (u8[off + 1] << 8) + (u8[off + 2] << 16) + (u8[off + 3] << 24)) >>> 0
            break
        case 9:
            c = (c + u8[off + 8]) >>> 0
            b = (b + u8[off + 4] + (u8[off + 5] << 8) + (u8[off + 6] << 16) + (u8[off + 7] << 24)) >>> 0
            a = (a + u8[off + 0] + (u8[off + 1] << 8) + (u8[off + 2] << 16) + (u8[off + 3] << 24)) >>> 0
            break
        case 8:
            b = (b + u8[off + 4] + (u8[off + 5] << 8) + (u8[off + 6] << 16) + (u8[off + 7] << 24)) >>> 0
            a = (a + u8[off + 0] + (u8[off + 1] << 8) + (u8[off + 2] << 16) + (u8[off + 3] << 24)) >>> 0
            break
        case 7:
            b = (b + u8[off + 4] + (u8[off + 5] << 8) + (u8[off + 6] << 16)) >>> 0
            a = (a + u8[off + 0] + (u8[off + 1] << 8) + (u8[off + 2] << 16) + (u8[off + 3] << 24)) >>> 0
            break
        case 6:
            b = (b + u8[off + 4] + (u8[off + 5] << 8)) >>> 0
            a = (a + u8[off + 0] + (u8[off + 1] << 8) + (u8[off + 2] << 16) + (u8[off + 3] << 24)) >>> 0
            break
        case 5:
            b = (b + u8[off + 4]) >>> 0
            a = (a + u8[off + 0] + (u8[off + 1] << 8) + (u8[off + 2] << 16) + (u8[off + 3] << 24)) >>> 0
            break
        case 4:
            a = (a + u8[off + 0] + (u8[off + 1] << 8) + (u8[off + 2] << 16) + (u8[off + 3] << 24)) >>> 0
            break;
        case 3:
            a = (a + u8[off + 0] + (u8[off + 1] << 8) + (u8[off + 2] << 16)) >>> 0
            break
        case 2:
            a = (a + u8[off + 0] + (u8[off + 1] << 8)) >>> 0
            break
        case 1:
            a = (a + u8[off + 0]) >>> 0
            break
        case 0:
            return c >>> 0
    }

    final()
    return c >>> 0
}

