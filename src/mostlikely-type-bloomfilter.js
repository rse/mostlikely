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

/*  This provides a Bloom Filter which can use both 4-bit counters
    (for supporting removal operations) and plain 1-bit masks.
    (see https://en.wikipedia.org/wiki/Bloom_filter)  */

/*  internal requirements  */
import BitField    from "./mostlikely-type-bitfield"
import MurmurHash3 from "./mostlikely-hash-murmurhash3"
import Jenkins     from "./mostlikely-hash-jenkins"
import CRC32       from "./mostlikely-hash-crc32"
import DJBX33X     from "./mostlikely-hash-djbx33x"
import FNV         from "./mostlikely-hash-fnv"

/*  the minimum number of bits for a particular item count and expected error rate  */
const LN2_SQUARED = Math.LN2 * Math.LN2
const minBits = (itemCount, errorRate) =>
    Math.round(-1.0 / LN2_SQUARED * itemCount * Math.log(errorRate))

/*  the number of hashes for a particular number of bits and an item count  */
const HASHES_MAX = 50
const numHashes = (numBits, itemCount) => {
    let hashes = Math.round((numBits / itemCount) * Math.LN2)
    if (hashes > HASHES_MAX)
        hashes = HASHES_MAX
    return hashes
}

/*  the hash functions  */
const hashes = [
    (data, size, num) => MurmurHash3(data, size, num),
    (data, size, num) => Jenkins    (data, size, num),
    (data, size, num) => CRC32      (data, size, num),
    (data, size, num) => DJBX33X    (data, size, num),
    (data, size, num) => FNV        (data, size, num)
]
const hash = (num, max, data, size) =>
    hashes[num % hashes.length](data, size, num)

/*  counter parameters (fully sufficient)  */
const COUNTER_BITS = 4
const COUNTER_MAX  = Math.pow(2, COUNTER_BITS) - 1

/*  counter operations  */
const bf_get = (bf, idx) => {
    let num = 0
    for (let i = 0; i < COUNTER_BITS; i++)
        num += ((bf.get(idx * COUNTER_BITS + i) ? 1 : 0) << i)
    return num
}
const bf_set = (bf, idx, num) => {
    if (num > COUNTER_MAX)
        num = COUNTER_MAX
    for (let i = 0; i < COUNTER_BITS; i++)
        bf.set(idx * COUNTER_BITS + i, num & (1 << i))
}

/*  the API class  */
export default class BloomFilter {
    /*  Bloom Filter object construction  */
    constructor (itemCount = 1000000, errorRate = 0.005, mask = true, counter = false) {
        if (!mask && !counter)
            throw new Error("at least one of mask or counter has to be enabled")
        this.nBits    = minBits(itemCount, errorRate)
        this.nBytes   = Math.ceil(this.nBits / 8)
        this.nBits    = this.nBytes * 8
        this.nHashes  = numHashes(this.nBits, itemCount)
        this.bfMask   = mask    ? new BitField(this.nBits)                : null
        this.bfCntr   = counter ? new BitField(this.nBits * COUNTER_BITS) : null
        return this
    }

    /*  export Bloom Filter details  */
    export (type = "rle+z85") {
        return {
            bits:   this.nBits,
            hashes: this.nHashes,
            mask:   this.bfMask ? this.bfMask.export(type) : null,
            cntr:   this.bfCntr ? this.bfCntr.export(type) : null
        }
    }

    /*  import Bloom Filter details  */
    import (obj, type = "rle+z85") {
        this.nBits   = obj.bits
        this.nBytes  = obj.bits * 8
        this.nHashes = obj.hashes
        this.bfMask  = obj.mask ? new BitField(type, obj.mask) : null
        this.bfCntr  = obj.cntr ? new BitField(type, obj.cntr) : null
        return this
    }

    /*  format Bloom Filter exports  */
    format (type = "rle+z85") {
        let e = this.export(type)
        return `${e.bits},${e.hashes},${e.mask ? e.mask : "-"},${e.cntr ? e.cntr : "-"}`
    }

    /*  parse Bloom Filter exports  */
    parse (str, type = "rle+z85") {
        let [ , bits, hashes, mask, cntr ] = str.match(/^(\d+),(\d+),(.+),(.+)$/)
        if (mask === "-") mask = null
        if (cntr === "-") cntr = null
        this.import({ bits, hashes, mask, cntr }, type)
        return this
    }

    /*  insert data into the Bloom filter  */
    insert (data, size = data.length) {
        for (let i = 0; i < this.nHashes; i++) {
            var idx = hash(i, this.nHashes, data, size) % this.nBits
            if (this.bfCntr) {
                let num = bf_get(this.bfCntr, idx)
                num++;
                bf_set(this.bfCntr, idx, num)
            }
            if (this.bfMask)
                this.bfMask.set(idx, true)
        }
        return this
    }

    /*  remove data from the Bloom filter (requires counters)  */
    remove (data, size = data.length) {
        if (!this.bfCntr)
            throw new Error("remove: removing elements requires counters")
        for (let i = 0; i < this.nHashes; i++) {
            var idx = hash(i, this.nHashes, data, size) % this.nBits
            let num = bf_get(this.bfCntr, idx)
            num--;
            if (num < 0)
                num = 0
            bf_set(this.bfCntr, idx, num)
            if (this.bfMask)
                if (num === 0)
                    this.bfMask.set(idx, false)
        }
        return this
    }

    /*  check whether data was once inserted into the Bloom Filter
        ATTENTION: this is the essential operation: it causes no
        false negatives (i.e. it 100% determines whether the data was
        NOT inserted) and causes false positives (i.e. it determines
        that the data was inserted, even if it actually was not) with
        approximately the expected errror rate  */
    contains (data, size = data.length) {
        for (let i = 0; i < this.nHashes; i++) {
            let idx = hash(i, this.nHashes, data, size) % this.nBits
            if (this.bfMask) {
                if (!this.bfMask.get(idx))
                    return false
            }
            else if (this.bfCntr) {
                if (bf_get(this.bfCntr, idx) === 0)
                    return false
            }
        }
        return true
    }

    /*  clear the Bloom Filter  */
    clear () {
        this.bfCntr.clear()
        this.bfMask.clear()
        return this
    }
}

