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

/* global describe: false */
/* global it: false */
/* jshint -W030 */
/* eslint no-unused-expressions: 0 */

var chai = require("chai")
var expect = chai.expect
chai.config.includeStack = true

var MostLikely = require("../lib/mostlikely.node.js")
var UUID = require("pure-uuid")

describe("MostLikely Library", function () {
    it("API availability", function () {
        var ml = new MostLikely()
        expect(ml).to.respondTo("export")
        expect(ml).to.respondTo("import")
        expect(ml).to.respondTo("parse")
        expect(ml).to.respondTo("format")
        expect(ml).to.respondTo("insert")
        expect(ml).to.respondTo("remove")
        expect(ml).to.respondTo("contains")
        expect(ml).to.respondTo("clear")
    })
    it("base functionality", function () {
        var bits = 1000
        var errorRate = 0.005
        var worstErrorRate = 0.010
        var ml = new MostLikely(bits, errorRate)
        var uuids1 = {}
        var uuids2 = {}
        var i
        for (i = 0; i < 1000; i++) {
            var uuid = new UUID(1)
            uuids1[i] = uuid
            ml.insert(uuid, 16)
            uuid = new UUID(1)
            uuids2[i] = uuid
        }
        var err1 = 0
        var err2 = 0
        for (i = 0; i < 1000; i++) {
            if (!ml.contains(uuids1[i], 16))
                err1++
            if (ml.contains(uuids2[i], 16))
                err2++
        }
        expect(err1).to.be.equal(0)
        var actualErrorRate = err2 / bits
        expect(actualErrorRate).to.be.most(worstErrorRate)
    })
})

