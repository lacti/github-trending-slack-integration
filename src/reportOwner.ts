import OwnerParameter from "./models/OwnerParameter";
import readOwner from "./readOwner";
import repoAsSlackMessage from "./support/repoAsSlackMessage";
import sendToSlack from "./support/sendToSlack";

export default async function reportOwner(
  params: OwnerParameter,
  {
    slackHookUrl = process.env.SLACK_HOOK_URL!,
    slackChannel = process.env.SLACK_OWNER_CHANNEL!,
  }: { slackHookUrl?: string; slackChannel?: string } = {}
): Promise<void> {
  if (!slackHookUrl) {
    throw new Error(`Please set proper "SLACK_HOOK_URL" to env.`);
  }
  if (!params.owner) {
    throw new Error(`Please set "owner" parameter`);
  }
  try {
    const repos = await readOwner(params);
    if (repos.length === 0) {
      return;
    }
    await sendToSlack(
      slackHookUrl,
      slackChannel,
      repoAsSlackMessage(params.owner, repos)
    );
    console.info({ params }, "Send owner report");
  } catch (error) {
    console.error({ error, params }, "Cannot report owner");
  }
}

if (require.main === module) {
  const owner = process.argv[2];
  reportOwner({ owner }).then(console.info);
}
