import TrendingParameter from "./models/TrendingParameters";
import readTrending from "./readTrending";
import sendToSlack from "./support/sendToSlack";
import trendAsSlackMessage from "./support/trendAsSlackMessage";

export default async function reportTrending(
  params: TrendingParameter,
  {
    slackHookUrl = process.env.SLACK_HOOK_URL!,
    slackChannel = process.env.SLACK_OWNER_CHANNEL!,
  }: { slackHookUrl?: string; slackChannel?: string } = {}
): Promise<void> {
  if (!slackHookUrl) {
    throw new Error(`Please set proper "SLACK_HOOK_URL" to env.`);
  }
  try {
    const trendings = await readTrending(params);
    if (trendings.length === 0) {
      return;
    }
    await sendToSlack(
      slackHookUrl,
      slackChannel,
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
  reportTrending({ language, period }).then(console.info);
}
