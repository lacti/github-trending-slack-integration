import OwnerParameter from "./models/OwnerParameter";
import SlackConnect from "./models/SlackConnect";
import readOwner from "./readOwner";
import repoAsSlackMessage from "./support/repoAsSlackMessage";
import sendToSlack from "./support/sendToSlack";
import slackOwnerConnect from "./env/slackOwnerConnect";

export default async function reportOwner(
  params: OwnerParameter,
  slackConnect: SlackConnect
): Promise<void> {
  if (!params.owner) {
    throw new Error(`Please set "owner" parameter`);
  }
  try {
    const repos = await readOwner(params);
    if (repos.length === 0) {
      return;
    }
    await sendToSlack(slackConnect, repoAsSlackMessage(params.owner, repos));
    console.info({ params }, "Send owner report");
  } catch (error) {
    console.error({ error, params }, "Cannot report owner");
  }
}

if (require.main === module) {
  const owner = process.argv[2];
  reportOwner({ owner }, slackOwnerConnect).then(console.info);
}
