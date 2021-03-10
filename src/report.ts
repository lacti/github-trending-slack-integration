import TrendingParameters from "./models/TrendingParameters";
import asSlackMessage from "./support/asSlackMessage";
import readTrending from "./readTrending";
import sendToSlack from "./support/sendToSlack";

export default async function report(
  params: TrendingParameters,
  slackHookUrl: string = process.env.SLACK_HOOK_URL!
) {
  if (!slackHookUrl) {
    throw new Error("Please set proper SLACK_HOOK_URL to env.");
  }
  return sendToSlack(
    slackHookUrl,
    asSlackMessage(
      params.language || "any",
      params.period || "any",
      await readTrending(params)
    )
  );
}

if (require.main === module) {
  const language = process.argv[2];
  const period = process.argv[3];
  report({ language, period })
    .then(console.log)
    .catch((error) => console.error(`Something is wrong`, error));
}
