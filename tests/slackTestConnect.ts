import SlackConnect from "../src/models/SlackConnect.js";

const slackChannel = process.env.TEST_SLACK_CHANNEL;
const slackHookUrl = process.env.TEST_SLACK_HOOK_URL;

const slackTestConnect: SlackConnect | undefined =
  slackChannel && slackHookUrl
    ? {
        slackChannel,
        slackHookUrl,
      }
    : undefined;

export default slackTestConnect;
