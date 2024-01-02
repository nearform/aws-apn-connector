import { Client } from "../../index.js";

const USERNAME = process.env.APN_USERNAME || "";
const PASSWORD = process.env.APN_PASSWORD || "";

const NAME = process.env.USERNAME || "FAILURESASAURUS REX";
(async () => {
  const apn = new Client({ headless: false });
  await apn.connect(USERNAME, PASSWORD);
  const result = await apn.users.deactivateByName(NAME);
  console.log(result);
  return apn.end();
})();
