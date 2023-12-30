import express from 'express'
import {Client} from '../index.js'

const app = express();
const apn = new Client({
  headless: true,
  args: [
    '--disable-gpu',
    '--no-sandbox',
  ],
  executablePath: 'google-chrome',
});
const PORT = process.env.PORT || 8080;
const USERNAME = process.env.APN_USERNAME;
const PASSWORD = process.env.APN_PASSWORD;

app.get('/opportunities', async (req, res) => {
  const opps = await apn.opportunities();
  res.send(opps);
});

app.get('/certifications', async (req, res) => {
  const certifications = await apn.certifications();
  res.send(certifications);
});


const start = async () => {
  await apn.connect(USERNAME, PASSWORD);
  app.listen(PORT, () => console.log(`AWS APN API Service now listening on port ${PORT}`));
};

start();
