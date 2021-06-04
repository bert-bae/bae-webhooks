import express from "express";
import { WebhookCipher } from "@bae/bae-webhooks";

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.post("/mock", async (req, res, next) => {
  const body = req.body;
  console.log("Mock server received request...");
  console.log(JSON.stringify(body, null, 2));
  res.status(200).send({ success: true });
});

app.listen(port, () => console.log(`Mock server listening on port ${port}`));
