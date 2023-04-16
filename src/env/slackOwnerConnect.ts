import slackEnv from "./slackEnv.js";

const slackOwnerConnect = {
  slackHookUrl: slackEnv.slackHookUrl,
  slackChannel: slackEnv.slackOwnerChannel,
};

export default slackOwnerConnect;
