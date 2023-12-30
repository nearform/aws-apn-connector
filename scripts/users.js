import { Client } from "../index.js";

const USERNAME = process.env.APN_USERNAME || "";
const PASSWORD = process.env.APN_PASSWORD || "";

(async () => {
  const apn = new Client({ headless: false });
  await apn.connect(USERNAME, PASSWORD);
  const users = await apn.deactivateUserByEmail('ben.williamson@nearform.com');
  // console.log(users);
  return apn.end();
})();
