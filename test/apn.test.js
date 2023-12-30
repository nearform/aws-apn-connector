"use strict";

import assert from "assert";
import { opportunitiesXLSXtoJSON } from "../index.js";

import { opportunities } from "./stubs.js";

describe("apn", function() {
  it("should parse XSLX feed and return it as a JSON array", function() {
    const xlsxString = opportunities(10);
    const feed = opportunitiesXLSXtoJSON(xlsxString);
    assert.equal(10, feed.length);
  });
});
