import APNConnector from "../../index.js";

const USERNAME = process.env.APN_USERNAME || "";
const PASSWORD = process.env.APN_PASSWORD || "";

(async () => {
  const apn = new APNConnector.Client({ headless: false });
  await apn.connect(USERNAME, PASSWORD);
  const result = await apn.usersAll();
  console.log(result);
  return apn.end();
})();
