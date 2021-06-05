import express from 'express'
import { createCommandContext } from './contextualizer'
import {
  BaseCommand,
  CreateOwnerCommand,
  DeleteOwnerCommand,
  GetOwnerCommand,
  RegenerateTokensCommand,
  CreateWebhookCommand,
  GetWebhooksCommand,
  UpdateWebhook,
  DeleteWebhookCommand,
  ProcessWebhookCommand,
} from './commands'

const app = express()
const port = process.env.PORT

const context = createCommandContext()
const processCommand = (command: BaseCommand) => async (req, res, next) => {
  const { body, params, query, headers } = req
  try {
    const providerResult = await command.execute({
      ...(query || {}),
      ...(params || {}),
      ...(body || {}),
    })
    res.status(200).json({ success: true, data: providerResult || {} })
  } catch (error) {
    context.logger.error('Server error', error)
    res.status(500).json({ success: false, error })
  }
}

app.use(express.json())

app.put(
  '/owners/:ownerId/webhooks/:webhookId',
  processCommand(new UpdateWebhook(context))
)
app.get(
  '/owners/:ownerId/webhooks',
  processCommand(new GetWebhooksCommand(context))
)
app.delete(
  '/owners/:ownerId/webhooks',
  processCommand(new DeleteWebhookCommand(context))
)
app.post(
  '/owners/:ownerId/webhooks',
  processCommand(new CreateWebhookCommand(context))
)

app.get('/owners/:id', processCommand(new GetOwnerCommand(context)))
app.put('/owners/:id', processCommand(new RegenerateTokensCommand(context)))
app.delete('/owners/:id', processCommand(new DeleteOwnerCommand(context)))
app.post('/owners', processCommand(new CreateOwnerCommand(context)))

app.post('/process', processCommand(new ProcessWebhookCommand(context)))

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
