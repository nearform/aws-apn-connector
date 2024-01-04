import APNConnector from "../index.js";

const USERNAME = process.env.APN_USERNAME || "";
const PASSWORD = process.env.APN_PASSWORD || "";

const NAME = process.env.USERNAME || "FAILURESASAURUS REX";
(async () => {
  const apn = new APNConnector.Client({ headless: false });
  await apn.connect(USERNAME, PASSWORD);
  const result = await apn.usersDeactivateByName(NAME);
  console.log(result);
  return apn.end();
})();
