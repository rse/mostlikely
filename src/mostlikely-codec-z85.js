/*
**  MostLikely -- Most-Likely Classification Through Bloom-Filtering
**  Copyright (c) 2016 Ralf S. Engelschall <rse@engelschall.com>
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

/*  ZeroMQ Base-85 (Z85) encoding/decoding algorithm.
    See http://rfc.zeromq.org/spec:32 for details on Z85.
    This code supports both raw Z85 and Z85 with padding.  */

/*  the encoder mapping table  */
const encoder = (
    "0123456789" +
    "abcdefghijklmnopqrstuvwxyz" +
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    ".-:+=^!/*?&<>()[]{}@%$#"
).split("")

/*  the decoder mapping table  */
const decoder = [
    0x00, 0x44, 0x00, 0x54, 0x53, 0x52, 0x48, 0x00,
    0x4B, 0x4C, 0x46, 0x41, 0x00, 0x3F, 0x3E, 0x45,
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
    0x08, 0x09, 0x40, 0x00, 0x49, 0x42, 0x4A, 0x47,
    0x51, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A,
    0x2B, 0x2C, 0x2D, 0x2E, 0x2F, 0x30, 0x31, 0x32,
    0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A,
    0x3B, 0x3C, 0x3D, 0x4D, 0x00, 0x4E, 0x43, 0x00,
    0x00, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10,
    0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
    0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F, 0x20,
    0x21, 0x22, 0x23, 0x4F, 0x00, 0x50, 0x00, 0x00
]

/*  the encoding/decoding constants  */
const INPUT_BLOCKLEN  = 4
const INPUT_BASE      = 256
const INPUT_DIVISOR   = Math.pow(INPUT_BASE, 3)
const OUTPUT_BLOCKLEN = 5
const OUTPUT_BASE     = 85
const OUTPUT_DIVISOR  = Math.pow(OUTPUT_BASE, 4)

/*  the API class  */
export default class Z85 {

    /*  raw Z85 encoding (no padding support)  */
    static encodeRaw (input, size = input.length) {
        if ((size % INPUT_BLOCKLEN) !== 0)
            throw new Error(`encodeRaw: invalid input length (multiple of ${INPUT_BLOCKLEN} expected)`)
        let str = "", i = 0, value = 0
        while (i < size) {
            value = (value * INPUT_BASE) + input[i++]
            if ((i % INPUT_BLOCKLEN) === 0) {
                let divisor = OUTPUT_DIVISOR
                while (divisor >= 1) {
                    let idx = Math.floor(value / divisor) % OUTPUT_BASE
                    str += encoder[idx]
                    divisor /= OUTPUT_BASE
                }
                value = 0
             }
        }
        return str
    }

    /*  raw Z85 decoding (no padding support)  */
    static decodeRaw (input, size = input.length) {
        if ((size % OUTPUT_BLOCKLEN) !== 0)
            throw new Error(`decodeRaw: invalid input length (multiple of ${OUTPUT_BLOCKLEN} expected)`);
        let dest = new Array(size * INPUT_BLOCKLEN / OUTPUT_BLOCKLEN)
        let i = 0, j = 0, value = 0
        while (i < size) {
            let idx = input.charCodeAt(i++) - 32
            if (idx < 0 || idx >= decoder.length)
                break
            value = (value * OUTPUT_BASE) + decoder[idx]
            if ((i % OUTPUT_BLOCKLEN) === 0) {
                let divisor = INPUT_DIVISOR
                while (divisor >= 1) {
                    dest[j++] = Math.trunc((value / divisor) % INPUT_BASE)
                    divisor /= INPUT_BASE
                }
                value = 0
            }
        }
        return dest
    }

    /*  Z85 encoding  */
    static encode (input, size = input.length) {
        let sig = size % INPUT_BLOCKLEN
        let pad = INPUT_BLOCKLEN - sig
        let sizeBorder = size - sig
        let output = this.encodeRaw(input, sizeBorder)
        if (sig > 0) {
            let suffix = new Array(INPUT_BLOCKLEN)
            for (let i = 0; i < INPUT_BLOCKLEN; i++)
                suffix[i] = i < sig ? input[sizeBorder + i] : 0
            let out = this.encodeRaw(suffix, INPUT_BLOCKLEN)
            output += out.substr(0, OUTPUT_BLOCKLEN - pad)
        }
        return output
    }

    /*  Z85 decoding  */
    static decode (input, size = input.length) {
        let pad = OUTPUT_BLOCKLEN - (size % OUTPUT_BLOCKLEN)
        if (pad > 0) {
            let suffix = ""
            for (let i = 0; i < pad; i++)
                suffix += "u"
            input += suffix
            size += pad
        }
        let output = this.decodeRaw(input, size)
        if (pad > 0)
            output.splice(output.length - pad, pad)
        return output
    }
}

