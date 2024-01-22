import APNConnector from "../index.js";

const USERNAME = process.env.APN_USERNAME || "";
const PASSWORD = process.env.APN_PASSWORD || "";

(async () => {
  const apn = new APNConnector.Client({ headless: false });
  await apn.connect(USERNAME, PASSWORD);
  const scorecard = await apn.scorecard();
  console.log(JSON.stringify(scorecard));
  return apn.end();
})();
