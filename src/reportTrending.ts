import SlackConnect from "./models/SlackConnect.js";
import TrendingParameter from "./models/TrendingParameters.js";
import readTrending from "./readTrending.js";
import sendToSlack from "./support/sendToSlack.js";
import trendAsSlackMessage from "./support/trendAsSlackMessage.js";

export default async function reportTrending(
  params: TrendingParameter,
  slackConnect: SlackConnect
): Promise<void> {
  try {
    const trendings = await readTrending(params);
    if (trendings.length === 0) {
      return;
    }
    await sendToSlack(
      slackConnect,
      trendAsSlackMessage(
        params.language || "any",
        params.period || "any",
        trendings
      )
    );
    console.info({ params }, "Send trending report");
  } catch (error) {
    console.error({ error, params }, "Cannot report trendings");
  }
}
