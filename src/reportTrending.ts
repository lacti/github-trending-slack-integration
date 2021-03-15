import SlackConnect from "./models/SlackConnect";
import TrendingParameter from "./models/TrendingParameters";
import readTrending from "./readTrending";
import sendToSlack from "./support/sendToSlack";
import slackTrendingConnect from "./env/slackTrendingConnect";
import trendAsSlackMessage from "./support/trendAsSlackMessage";

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

if (require.main === module) {
  const language = process.argv[2];
  const period = process.argv[3];
  reportTrending({ language, period }, slackTrendingConnect).then(console.info);
}
