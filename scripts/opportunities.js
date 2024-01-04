import APNConnector from "../index.js";

const USERNAME = process.env.APN_USERNAME || "";
const PASSWORD = process.env.APN_PASSWORD || "";

(async () => {
  const apn = new APNConnector.Client({ headless: true });
  await apn.connect(USERNAME, PASSWORD);
  const opportunities = await apn.opportunitiesAll();

  
  console.log(opportunities);
  return apn.end();
})();
