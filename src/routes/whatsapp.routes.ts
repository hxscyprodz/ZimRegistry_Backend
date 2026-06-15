import { Router } from "express";
import { verifyWebhookToken } from "../controllers/whatsapp/verifyWebhook";
import { incomingMessages } from "../controllers/whatsapp/incomingMessagesHandler";

const router = Router();

router.get("/messages", verifyWebhookToken());
router.post("/messages", incomingMessages);

export default router;
