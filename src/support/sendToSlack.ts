import asSlackMessage from "./asSlackMessage";
import fetch from "node-fetch";

export default async function sendToSlack(
  slackHookUrl: string,
  message: ReturnType<typeof asSlackMessage>
) {
  const sent = await fetch(slackHookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  }).then((r) => r.text());
  if (sent !== "ok") {
    throw new Error(`Invalid response: ${sent}`);
  }
  return sent;
}
