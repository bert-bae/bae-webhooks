import express from 'express'
import axios from 'axios'
import { WebhookCipher } from '@bae/webhook-client'

const app = express()
const port = process.env.PORT

app.use(express.json())

const webhookCipher = new WebhookCipher()

app.get('/create-mocks', async (req, res, next) => {
  const {
    data: { data: owner },
  } = await axios.post(`${process.env.WEBHOOK_SERVER_URL}/owners`, {})

  const {
    data: { data: webhook },
  } = await axios.post(
    `${process.env.WEBHOOK_SERVER_URL}/owners/${owner.id}/webhooks`,
    { accessToken: owner.accessToken, url: 'http://localhost:4000/mock' }
  )

  await axios.put(
    `${process.env.WEBHOOK_SERVER_URL}/owners/${owner.id}/webhooks/${webhook.webhookId}`,
    {
      url: webhook.url,
      topics: ['Test'],
    }
  )
  res.status(200).json({
    owner,
    webhook,
    instructions: {
      message: `Send a POST request to ${process.env.WEBHOOK_SERVER_URL}/process with the following settings. The owner's secret token ${owner.secretToken} needs to be set in WEBHOOK_SERVER_URL environment variable.`,
      headers: {
        'content-type': 'application/json',
      },
      body: `{"type": "Test", "ownerId": "${owner.id}", "data": { "example": "Any test data can go here"}}`,
    },
  })
})

app.post('/mock', async (req, res, next) => {
  const body = req.body
  console.log(
    'Mock server received request with encrypted payload: ',
    body.payload
  )

  const decrypted = webhookCipher.decrypt(
    body.payload,
    process.env.WEBHOOK_SECRET_TOKEN
  )
  console.log('Webhook event received...')
  console.log(decrypted)
  res.status(200).send({ success: true })
})

app.listen(port, () => console.log(`Mock server listening on port ${port}`))
