import logger from "../services/logger";
import {
  MAIN_MENU_REPLY_ID,
  VIEW_BOOKING_MENU_REPLY_ID,
  TEXT_COMMANDS_ID,
  FEATURE_COMING_SOON_REPLY_ID,
} from "../constants";
import messageComposer from "./whatsapp/messagesComposer";
import WhatsappMessages from "./whatsapp/messages";
import whatsappMessager from "./whatsapp/outgoingMessagesHandler";
import { InteractivePayLoad } from "../types/types";
import { MainMenuSections } from "./whatsapp/messages/mainMenu";

const buttonReplyHandler = async (clientNumber: string, replyId: string) => {
  const TAG = "[REPLY-BUTTON-MESSAGE]";
  try {
    switch (replyId) {
      case FEATURE_COMING_SOON_REPLY_ID.back_to_main_menu: {
        await whatsappMessager.sendInteractive(
          clientNumber,
          messageComposer.messageWithReplyList({
            text: WhatsappMessages.TextMessages.mainMenuText,
            sections: MainMenuSections,
            listName: "Main Menu",
          }),
        );
      }
    }
  } catch (error) {
    logger.error("Error on button reply handler", error);
  }
  return;
};

const listReplyHandler = async (clientNumber: string, replyId: string) => {
  const TAG = "[REPLY-LIST-MESSAGE]";
  logger.info(`${TAG} Received a list reply message`, replyId);
  try {
    switch (replyId) {
      case MAIN_MENU_REPLY_ID.application_tracking:
        {
          await whatsappMessager.sendInteractive(
            clientNumber,
            messageComposer.messageWithReplyButtons({
              text: WhatsappMessages.TextMessages.featureComingSoonText,
              buttons: [
                {
                  type: "reply",
                  reply: {
                    id: FEATURE_COMING_SOON_REPLY_ID.back_to_main_menu,
                    title: "Back to Main Menu",
                  },
                },
              ],
            }),
          );
        }
        break;
      case MAIN_MENU_REPLY_ID.birth_certificate_application:
        {
          await whatsappMessager.sendInteractive(
            clientNumber,
            messageComposer.messageWithReplyButtons({
              text: WhatsappMessages.TextMessages.featureComingSoonText,
              buttons: [
                {
                  type: "reply",
                  reply: {
                    id: FEATURE_COMING_SOON_REPLY_ID.back_to_main_menu,
                    title: "Back to Main Menu",
                  },
                },
              ],
            }),
          );
        }
        break;
      case MAIN_MENU_REPLY_ID.national_id_application:
        {
          await whatsappMessager.sendInteractive(
            clientNumber,
            messageComposer.messageWithReplyButtons({
              text: WhatsappMessages.TextMessages.featureComingSoonText,
              buttons: [
                {
                  type: "reply",
                  reply: {
                    id: FEATURE_COMING_SOON_REPLY_ID.back_to_main_menu,
                    title: "Back to Main Menu",
                  },
                },
              ],
            }),
          );
        }
        break;
      case VIEW_BOOKING_MENU_REPLY_ID.cancel:
        {
          logger.info("The cancel button was clicked");
        }
        break;
      case VIEW_BOOKING_MENU_REPLY_ID.reschedule:
        logger.info("The reschedule button was clicked");
        break;
      default:
        break;
    }
  } catch (error) {
    logger.error("Error on list reply handler", error);
    throw error;
  }
};

const textReplyHandler = async (clientNumber: string, text: string) => {
  const TAG = "[TEXT MESSAGE]";
  logger.info(`${TAG} Received Text Reply Message`);
  try {
    switch (text.toLowerCase()) {
      case TEXT_COMMANDS_ID.hi:
        {
          await whatsappMessager.sendInteractive(
            clientNumber,
            messageComposer.messageWithReplyList({
              text: WhatsappMessages.TextMessages.mainMenuText,
              sections: MainMenuSections,
              listName: "Main Menu",
            }),
          );
        }
        break;
      default:
        break;
    }

    return;
  } catch (error) {
    logger.error(`${TAG} Error on text reply message `, error);
    throw error;
  }
};

const interactiveReplyHandler = async (
  clientNumber: string,
  interactive: InteractivePayLoad,
) => {
  const interactiveType = interactive.type;
  const TAG = "[INTERACTIVE MESSAGE]";
  try {
    logger.info(`${TAG} Received interactive Reply Message`);
    switch (interactiveType) {
      case "button_reply":
        {
          await buttonReplyHandler(clientNumber, interactive.button_reply.id);
        }
        break;
      case "list_reply": {
        const listReply = interactive.list_reply.id;
        logger.info(`list reply message with ID ${listReply}`);
        await listReplyHandler(clientNumber, listReply);
        break;
      }
      default:
        break;
    }

    return;
  } catch (error) {
    logger.error(`${TAG} Error on interactive reply message `, error);
    throw error;
  }
};

const CONVERSATION_CONTROLLER = {
  buttonReplyHandler,
  listReplyHandler,
  interactiveReplyHandler,
  textReplyHandler,
};

export default CONVERSATION_CONTROLLER;
