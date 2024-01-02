import { Client } from "../index.js";

const USERNAME = process.env.APN_USERNAME || "";
const PASSWORD = process.env.APN_PASSWORD || "";

(async () => {
  const apn = new Client({ headless: true });
  await apn.connect(USERNAME, PASSWORD);
  const opportunities = await apn.opportunities.all();

  
  console.log(opportunities);
  return apn.end();
})();
