const express = require("express");
const apn = require("./lib/apn");

const app = express();
const PORT = process.env.PORT || 8080;
const USERNAME = process.env.APN_USERNAME;
const PASSWORD = process.env.APN_PASSWORD;


app.get("/opportunities", async(req, res) => {
  const opps = await apn.opportunities()
  res.send(opps);
});

app.get("certifications", async (req, res)=>{
  const certifications = await apn.certifications();
  res.send(certifications);
});


let start = async () => {
  await apn.init(USERNAME, PASSWORD, {
    headless: true,
    args: [
        '--disable-gpu',
        '--no-sandbox',
    ],
    executablePath: 'google-chrome'
  });
  app.listen(PORT, () => logger.log(`Listening on port ${PORT}`))
};

start();