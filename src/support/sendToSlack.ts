import fetch from "node-fetch";
import trendAsSlackMessage from "./trendAsSlackMessage";

export default async function sendToSlack(
  slackHookUrl: string,
  slackChannel: string,
  message: ReturnType<typeof trendAsSlackMessage>
) {
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
