const path=require('path');
require('dotenv').config({
  path: path.resolve(process.cwd(), '.env.local',
  )});


const apn = require('./lib/apn');


const USERNAME = process.env.APN_USERNAME||'';
const PASSWORD = process.env.APN_PASSWORD||'';

(async () => {
  await apn.init(USERNAME, PASSWORD);
  const certs = await apn.certifications();
  console.log(certs);
  await apn.close();
})();
