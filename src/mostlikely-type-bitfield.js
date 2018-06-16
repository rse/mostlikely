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

/*  This is a simple bitfield, but with import/export functionality.  */

import Z85         from "./mostlikely-codec-z85"
import B16         from "./mostlikely-codec-b16"
import RLE         from "./mostlikely-codec-rle"
import OctetArray  from "./mostlikely-type-octetarray"

export default class BitField {
    constructor (...args) {
        if (args.length === 2)
            this.import(...args)
        else if (args.length === 1 && typeof args[0] === "number") {
            if (args[0] % 8 !== 0)
                throw new Error("number of bits have to be a multiple of 8")
            let numBytes = args[0] >>> 3
            this.data = OctetArray.create(numBytes, true)
        }
        else
            throw new Error("invalid or missing constructor argument")
    }
    size () {
        return (this.data.length << 3)
    }
    get (pos) {
        let posByte = pos >>> 3
        if (posByte >= this.data.length)
            throw new Error("bit position out of range")
        let posBit = 0x80 >>> (pos % 8)
        return !!(this.data[posByte] & posBit)
    }
    set (pos, val) {
        let posByte = pos >>> 3
        if (posByte >= this.data.length)
            throw new Error("bit out of range")
        let posBit = 0x80 >>> (pos % 8)
        if (val)
            this.data[posByte] |= posBit
        else
            this.data[posByte] &= ~posBit
        return this
    }
    clear () {
        for (let i = 0, l = this.data.length; i < l; i++)
            this.data[i] = 0x00
        return this
    }
    export (type) {
        if (typeof type !== "string" || !type.match(/^(?:rle\+)?(?:array|b16|z85)$/))
            throw new Error("invalid export type")
        let m = type.match(/^rle\+(.+)$/)
        let rle = false
        if (m !== null) {
            rle = true
            type = m[1]
        }
        let input = this.data
        if (rle) {
            let size = RLE.encodeSize(this.data)
            input = new Array(size)
            RLE.encode(this.data, input)
        }
        let output
        if (type === "z85")
            output = Z85.encode(input, input.length)
        else if (type === "b16")
            output = B16.encode(input, input.length)
        else if (type === "array")
            output = rle ? input : Array.prototype.slice.call(input, 0)
        return output
    }
    import (type, data) {
        if (typeof type !== "string" || !type.match(/^(?:rle\+)?(?:array|b16|z85)$/))
            throw new Error("invalid import type")
        let m = type.match(/^rle\+(.+)$/)
        let rle = false
        if (m !== null) {
            rle = true
            type = m[1]
        }
        let input
        if (type === "z85")
            input = Z85.decode(data)
        else if (type === "b16")
            input = B16.decode(data)
        else if (type === "array")
            input = data
        if (rle) {
            let size = RLE.decodeSize(input)
            this.data = OctetArray.create(size, false)
            RLE.decode(input, this.data)
        }
        else {
            let size = input.length
            this.data = OctetArray.create(size, false)
            for (let i = 0; i < size; i++)
                this.data[i] = input[i]
        }
        return this
    }
}

