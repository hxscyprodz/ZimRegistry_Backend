import express, { Request, Response } from "express";
import config from "../../config/envConfig";

interface payload {
  "hub.mode": string;
  "hub.verify_token": string;
  "hub.challenge": string;
}
export const verifyWebhookToken =
  () =>
  async (request: Request<{ Querystring: payload }>, response: Response) => {
    const verifyToken = config.WHATSAPP_WEBHOOK_VERIFICATION_TOKEN;
    const mode = request.query["hub.mode"];
    const token = request.query["hub.verify_token"];
    const challenge = request.query["hub.challenge"];
    if (mode && token) {
      if (mode === "subscribe" && token === verifyToken) {
        return response.status(200).send(challenge);
      } else {
        return response.status(403).send({
          success: false,
          message: "Invalid request: Invalid mode or token",
        });
      }
    } else {
      return response.status(403).send({
        success: false,
        message: "Invalid request: Missing mode or token",
      });
    }
  };