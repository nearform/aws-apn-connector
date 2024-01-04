import APNConnector from "../index.js";
import assert from "assert";

import { opportunities } from "./stubs.js";

describe("apn", function() {
  it("should parse XSLX feed and return it as a JSON array", function() {
    const Client = APNConnector.Client;
    for (var i in Client) {
      console.log(i)
    }
    console.log(Client.opportunitiesXLSXtoJSON)
    const xlsxString = opportunities(10);
    const feed = APNConnector.Client.opportunitiesXLSXtoJSON(xlsxString);
    assert.equal(10, feed.length);
  });
});
