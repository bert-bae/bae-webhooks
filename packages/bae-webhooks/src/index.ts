import express from "express";
import bodyParser from "body-parser";
import { createContext } from "./contextualizer";
import { OwnerProvider, WebhookProvider, BaseProvider } from "./providers";

const context = createContext();
const webhookProvider = new WebhookProvider(context);
const ownerProvider = new OwnerProvider(context);

const app = express();
const port = process.env.PORT;

const processRequest =
  (providerMethod: BaseProvider["create" | "read" | "update" | "delete"]) =>
  async (req, res, next) => {
    const { body, params, headers } = req;
    try {
      const providerResult = await providerMethod({
        ...(params || {}),
        ...(body || {}),
      });
      res.status(200).json({ success: true, data: providerResult || {} });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  };

app.use(bodyParser.json());

app.get("/owners/:id", processRequest(ownerProvider.read));
app.put("/owners/:id", processRequest(ownerProvider.update));
app.delete("/owners/:id", processRequest(ownerProvider.delete));
app.post("/owners", processRequest(ownerProvider.create));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
