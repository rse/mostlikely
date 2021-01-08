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

/*  Base16 (aka hexadecimal) encoding/decoding  */

const OctetArray = require("./mostlikely-type-octetarray.js")

module.exports = class B16 {
    static encode (data, size = data.length) {
        let arr = new Array(size)
        for (let i = 0; i < size; i++) {
            let hex = data[i].toString(16).toUpperCase()
            if (hex.length < 2)
                hex = "0" + hex
            arr[i] = hex
        }
        return arr.join("")
    }
    static decode (str, dest) {
        if (typeof dest === "undefined")
            dest = OctetArray.create(str.length / 2, false)
        let pos = 0
        for (let i = 0, l = str.length; i < l; i += 2)
            dest[pos++] = parseInt(str.substr(i, 2), 16)
        return dest
    }
}

