"use strict";

import assert from "assert";
import { Client } from "../index.js";

import {opportunities} from "./stubs.js";

describe("apn", () => {
  const apn = new Client();
  it("should parse XSLX feed and return it as a JSON array", () => {
    const xlsxString = opportunities(10);
    const feed = apn._opportunitiesXLSXtoJSON(xlsxString);
    assert.equal(10, feed.length);
  });
});
