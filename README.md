# Webhook Service Demo

Simple webhook service repository to demonstrate how webhooks might be used to subscribe URLs for specific owners in order to forward events. This uses lerna, typescript, and the command pattern and consists of three packages:

- webhook-client
- webhook-server
- mock-server

## Webhook Server

The webhook server contains the core logic for creating the necessary entities to define webhooks and process events to forward to subscribed webhooks.

#### Entities

Owner:

- This entity can own one or more webhooks. The owner has information about the secret token that is required to decrypt the webhook payload.

Webhook:

- This entity defines the URL and Topics that a specific webhook entry should receive from events that are processed. The `Topics[]` contains the set of events the URL should receive while the rest are ignored.

## Mock Server

This is a simple server that has two endpoints.

- `POST /create-mocks` will create a owner with the secret token required to decrypt the event and a webhook subscribed to a "Test" topic. It will then provide instructions on how to make a `POST` request to the webhook server's `POST /process` endpoint. Typically the webhook server's endpoint will not be accessible publically, but for the purpose of local development this request will trigger the `process-webhook-command.ts` file and forward the event (if the event type is subscribed) to the subscribed webhook URL.

#### Decryption of Payload

The webhook server should not receive any specific API keys or authentication keys when the webhook is subscribed. Since each API by third party owners that subscribed to the webhook service may implement different security methods, the webhook server expects that the webhooks they are trying to send data to will not be restricted to some authentication method. Instead, the event data will be encrypted which can only be decrypted on the subscribed webhook endpoint by decrypting it using the secret token and the initial vector that is provided in the encrypted hash.

## Webhook Client

This is a simple library to support 3rd party owners and the webhook server. Since the mock-server and webhook-server both need to understand how to encrypt and decrypt data in the same manner, this package will provide the `WebhookCipher` class with the `encrypt` and `decrypt` methods.

Lerna is used to package the webhook-client library into both the mock-server and webhook-server's packages so that they are accessible without having to publish to `npm` each time. The idea is for the webhook-client to be published to `npm` as a library in order to provide 3rd party users of the webhook service an easy and prepared codebase that will assist them with the decryption of the event hash provided that they are setting the secret key correctly.

# Getting started

From root:

1. `npm i`
2. `npm run bootstrap`
3. `npm run build`

From packages/webhook-server:

1. Copy the `.env.template` into a `.env` file
2. Start docker-compose with dynamodb with `docker-compose up` (might need `sudo docker-compose up`)
3. Initialize the dynamodb tables with `node init-db.js`
4. `npm run dev`

From packages/mock-server:

1. Copy the `.env.template` into a `.env` file
2. `npm run dev`

Call the create-mocks endpoint to generate dummy data:

1. `POST /create-mocks`
2. Retrieve the response payload and follow the instructions. You will need to copy the secret token from the owner object and add it to the `.env` of the mock-server and restart the mock-server for it to be able to correctly decrypt the encrypted hash event payloads when data is forwarded to subscribed webhooks.
