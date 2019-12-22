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

/* jshint -W030 */
/* eslint no-unused-expressions: 0 */

const chai = require("chai")
const expect = chai.expect
chai.config.includeStack = true

const MostLikely = require("../lib/mostlikely.node.js")
const UUID = require("pure-uuid")

describe("MostLikely Library", () => {
    it("API availability", () => {
        let ml = new MostLikely()
        expect(ml).to.respondTo("export")
        expect(ml).to.respondTo("import")
        expect(ml).to.respondTo("parse")
        expect(ml).to.respondTo("format")
        expect(ml).to.respondTo("insert")
        expect(ml).to.respondTo("remove")
        expect(ml).to.respondTo("contains")
        expect(ml).to.respondTo("clear")
    })
    it("base functionality", () => {
        let bits = 1000
        let errorRate = 0.005
        let worstErrorRate = 0.010
        let ml = new MostLikely(bits, errorRate)
        let uuids1 = {}
        let uuids2 = {}
        for (let i = 0; i < 1000; i++) {
            var uuid = new UUID(1)
            uuids1[i] = uuid
            ml.insert(uuid, 16)
            uuid = new UUID(1)
            uuids2[i] = uuid
        }
        let err1 = 0
        let err2 = 0
        for (let i = 0; i < 1000; i++) {
            if (!ml.contains(uuids1[i], 16))
                err1++
            if (ml.contains(uuids2[i], 16))
                err2++
        }
        expect(err1).to.be.equal(0)
        let actualErrorRate = err2 / bits
        expect(actualErrorRate).to.be.most(worstErrorRate)
    })
    it("B16 coded", () => {
        const B16 = require("../src/mostlikely-codec-b16.js")
        const drive = (str) => {
            let data = typeof str === "string" ? Buffer.from(str) : str
            let enc = B16.encode(data)
            let data2 = B16.decode(enc)
            expect(data.toString()).to.be.equal(data2.toString())
        }
        drive("")
        drive(Buffer.from([0x00]))
        drive(Buffer.from([0x00, 0x00, 0x00, 0x00]))
        drive(Buffer.from([0x01, 0x02, 0x03]))
        drive(Buffer.from([0x86, 0x4F, 0xD2, 0x6F, 0xB5, 0x59, 0xF7, 0x5B]))
        drive("foo")
        drive("fooo")
        drive("foo!foo")
        drive("foo!")
    })
    it("Z85 coded", () => {
        const Z85 = require("../src/mostlikely-codec-z85.js")
        const drive = (str) => {
            let data = typeof str === "string" ? Buffer.from(str) : str
            let enc = Z85.encode(data)
            let data2 = Z85.decode(enc)
            expect(data.toString()).to.be.equal(data2.toString())
        }
        drive("")
        drive(Buffer.from([0x00]))
        drive(Buffer.from([0x00, 0x00, 0x00, 0x00]))
        drive(Buffer.from([0x01, 0x02, 0x03]))
        drive(Buffer.from([0x86, 0x4F, 0xD2, 0x6F, 0xB5, 0x59, 0xF7, 0x5B]))
        drive("foo")
        drive("fooo")
        drive("foo!foo")
        drive("foo!")
    })
    it("export/import functionality", () => {
        let ml = new MostLikely(1000, 0.001)
        for (let i = 0; i < 1000; i++) {
            var uuid = new UUID(1)
            ml.insert(uuid, 16)
        }
        let data = ml.export()
        let ml2 = new MostLikely(1000, 0.001)
        ml2.import(data)
        let data2 = ml2.export()
        expect(data).to.be.deep.equal(data2)
    })
})

