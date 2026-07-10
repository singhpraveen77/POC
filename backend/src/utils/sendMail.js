import { BrevoClient } from "@getbrevo/brevo";
import logger from "../../config/logger.js";
import "dotenv/config";

logger.info("Initializing Brevo client", {
  apiKeyExists: Boolean(process.env.BREVO_API_KEY),
  apiKeyPrefix: process.env.BREVO_API_KEY?.slice(0, 8),
  senderEmailExists: Boolean(process.env.BREVO_SENDER_EMAIL),
  senderEmail: process.env.BREVO_SENDER_EMAIL,
});

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export const sendMail = async (to, subject, html) => {
  const startedAt = Date.now();

  try {
    logger.info("sendMail function started", {
      to,
      subject,
      htmlExists: Boolean(html),
      htmlLength: html?.length || 0,
    });

    if (!process.env.BREVO_API_KEY) {
      logger.error("Brevo API key missing");

      throw new Error(
        "BREVO_API_KEY is not defined in environment variables"
      );
    }

    logger.info("Brevo API key found", {
      apiKeyPrefix: process.env.BREVO_API_KEY.slice(0, 8),
      apiKeyLength: process.env.BREVO_API_KEY.length,
    });

    if (!process.env.BREVO_SENDER_EMAIL) {
      logger.error("Brevo sender email missing");

      throw new Error(
        "BREVO_SENDER_EMAIL is not defined in environment variables"
      );
    }

    logger.info("Brevo sender configured", {
      senderEmail: process.env.BREVO_SENDER_EMAIL,
    });

    if (!to) {
      logger.error("Recipient email missing");

      throw new Error("Recipient email is required");
    }

    logger.info("Recipient validated", {
      recipientEmail: to,
    });

    const emailPayload = {
      sender: {
        name: "Kanban Board",
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: html,
    };

    logger.info("Brevo email payload prepared", {
      sender: emailPayload.sender,
      to: emailPayload.to,
      subject: emailPayload.subject,
      htmlLength: emailPayload.htmlContent?.length || 0,
    });

    logger.info("Calling Brevo transactional email API", {
      to,
      timestamp: new Date().toISOString(),
    });

    const result =
      await brevo.transactionalEmails.sendTransacEmail(
        emailPayload
      );

    logger.info("Brevo API call completed", {
      durationMs: Date.now() - startedAt,
      resultExists: Boolean(result),
      resultType: typeof result,
      resultKeys:
        result && typeof result === "object"
          ? Object.keys(result)
          : [],
    });

    logger.info("Brevo API response", {
      messageId: result?.messageId,
      response: result,
    });

    if (!result?.messageId) {
      logger.warn(
        "Brevo API returned without a messageId",
        {
          to,
          result,
        }
      );
    } else {
      logger.info(
        "Email accepted by Brevo for processing",
        {
          to,
          messageId: result.messageId,
          durationMs: Date.now() - startedAt,
        }
      );
    }

    return result;
  } catch (error) {
    logger.error("Email sending failed", {
      to,
      subject,

      errorName: error?.name,
      errorMessage: error?.message,
      errorCode: error?.code,
      statusCode:
        error?.statusCode ||
        error?.status ||
        error?.response?.status,

      responseData:
        error?.response?.data ||
        error?.body,

      errorKeys:
        error && typeof error === "object"
          ? Object.keys(error)
          : [],

      durationMs: Date.now() - startedAt,

      stack: error?.stack,
    });

    throw error;
  }
};