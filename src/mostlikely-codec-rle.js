/*
**  MostLikely -- Most-Likely Classification Through Bloom-Filtering
**  Copyright (c) 2016-2023 Dr. Ralf S. Engelschall <rse@engelschall.com>
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

/*  Run-Length-Encoding (RLE) for zeros.  */

module.exports = class RLE {
    static encodeSize (from) {
        const l = from.length
        let j = 0
        for (let i = 0; i < l; i++, j++) {
            if (from[i] === 0) {
                let k = 1
                while (i < l && from[i + 1] === 0 && k < 0xFF) {
                    k++
                    i++
                }
                ++j
            }
        }
        return j
    }
    static encode (from, to) {
        const l = from.length
        for (let i = 0, j = 0; i < l; i++, j++) {
            to[j] = from[i]
            if (from[i] === 0) {
                let k = 1
                while (i < l && from[i + 1] === 0 && k < 0xFF) {
                    k++
                    i++
                }
                to[++j] = k
            }
        }
        return this
    }
    static decodeSize (from) {
        const l = from.length
        let j = 0
        for (let i = 0; i < l; i++, j++) {
            if (from[i] === 0)
                for (let k = from[++i]; k > 1; k--)
                    ++j
        }
        return j
    }
    static decode (from, to) {
        const l = from.length
        for (let i = 0, j = 0; i < l; i++, j++) {
            to[j] = from[i]
            if (from[i] === 0)
                for (let k = from[++i]; k > 1; k--)
                    to[++j] = 0
        }
        return this
    }
}

