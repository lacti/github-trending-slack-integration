import OwnerParameter from "./models/OwnerParameter.js";
import SlackConnect from "./models/SlackConnect.js";
import readOwner from "./readOwner.js";
import repoAsSlackMessage from "./support/repoAsSlackMessage.js";
import sendToSlack from "./support/sendToSlack.js";

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
