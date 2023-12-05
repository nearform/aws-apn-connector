import { Client } from "../index.js";

const USERNAME = process.env.APN_USERNAME || "";
const PASSWORD = process.env.APN_PASSWORD || "";

(async () => {
  const apn = new Client({ headless: false });
  await apn.connect(USERNAME, PASSWORD);
  const certs = await apn.opportunities();
  console.log(certs);
  return apn.end();
})();
