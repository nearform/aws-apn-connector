'use strict';
require('dotenv').config();

const apn = require('../lib/apn');


const USERNAME = process.env.APN_USERNAME||'';
const PASSWORD = process.env.APN_PASSWORD||'';

(async () => {
  await apn.init(USERNAME, PASSWORD);
  const certs = await apn.certifications();
  console.log(certs);
  await apn.close();
})();
