import { Request, Response } from "express";
import logger from "../../services/logger";
import {
  WebhookNotificationBody,
  InteractivePayLoad,
} from "../../types/types";

export const incomingMessages = async (req: Request, res: Response) => {
  const reqBody: WebhookNotificationBody = req.body;
  if (reqBody.object) {
    const { messages } = reqBody.entry[0].changes[0].value;
    if (messages) {
      const notificationType = messages[0].type;
      const clientNumber = messages[0].from;

      switch (notificationType) {
        case "text":
          const messageText = messages[0].text.body;
          logger.warn(messageText);
          break;
        case "interactive":
          {
            const interactivePayload: InteractivePayLoad =
              messages[0].interactive;
            logger.warn(interactivePayload);
          }
          break;
        case "image":
          {
            const imagePayload = messages[0].image;
            logger.info(
              `[IMAGE MESSAGE]: Received from ${clientNumber}. ID: ${imagePayload.id}`,
            );
            if (imagePayload.caption)
              logger.info(`Caption: ${imagePayload.caption}`);
          }
          break;

        case "order":
          {
            logger.info(
              "Processing WhatsApp catalog order from:",
              clientNumber,
            );
            const rawOrder = messages[0].order;
            logger.warn(rawOrder);
          }
          break;
        case "reaction":
          {
            logger.info("[REACTION MESSAGE]: Received a reaction Message");
          }
          break;
        default:
          break;
      }
    }
  }
  res.status(200).json({
    success: true,
  });
};
