'use strict';

require('dotenv').config();

const apn = require('../lib/apn');


const USERNAME = process.env.APN_USERNAME||'';
const PASSWORD = process.env.APN_PASSWORD||'';

(async () => {
  await apn.init(USERNAME, PASSWORD);
  const opps = await apn.opportunities();
  console.log(opps);
  await apn.close();
})();
