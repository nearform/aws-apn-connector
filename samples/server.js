import express from 'express'
import APNConnector from '../index.js'


console.log(process.env)

const PORT = process.env.PORT || 8080
const USERNAME = process.env.APN_USERNAME
const PASSWORD = process.env.APN_PASSWORD


const app = express()
const apn = new APNConnector.Client({
  headless: true,
  args: ['--disable-gpu', '--no-sandbox']
})

app.get('/opportunities', async (req, res) => {
  const opps = await apn.opportunitiesAll()
  res.send(opps)
})

app.get('/certifications', async (req, res) => {
  const certifications = await apn.certificationsAll()
  res.send(certifications)
})

const start = async () => {
  await apn.connect(USERNAME, PASSWORD)
  app.listen(PORT, () =>
    console.log(`AWS APN API Service now listening on port ${PORT}`)
  )
}

start()
