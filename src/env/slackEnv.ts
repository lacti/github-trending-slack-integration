const slackEnv = {
  slackHookUrl: process.env.SLACK_HOOK_URL!,
  slackTrendingChannel: process.env.SLACK_TRENDING_CHANNEL!,
  slackOwnerChannel: process.env.SLACK_OWNER_CHANNEL!,
};

export default slackEnv;
