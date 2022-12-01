'use strict';

const assert = require('assert');
const apn = require('../lib/apn');

const stubs = require('./stubs');


describe('apn', () => {
  it('should parse XSLX feed and return it as a JSON array', () => {
    const xlsxString = stubs.opportunities(10);
    const feed = apn._opportunitiesXLSXtoJSON(xlsxString);
    assert.equal(10, feed.length);
  });
});
