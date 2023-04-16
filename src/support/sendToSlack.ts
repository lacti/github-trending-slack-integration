import SlackConnect from "../models/SlackConnect.js";
import fetch from "node-fetch";

interface SlackMessage {
  username?: string;
  attachments?: {
    color?: string;
    text: string;
  }[];
  text?: string;
}

export default async function sendToSlack(
  { slackHookUrl, slackChannel }: SlackConnect,
  message: SlackMessage
) {
  if (!slackHookUrl) {
    throw new Error(`Please set proper "SLACK_HOOK_URL" to env.`);
  }
  const sent = await fetch(slackHookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...message, channel: slackChannel }),
  }).then((r) => r.text());
  if (sent !== "ok") {
    throw new Error(`Invalid response: ${sent}`);
  }
  return sent;
}
