import SlackConnect from "../models/SlackConnect.js";
import slackEnv from "./slackEnv.js";

const slackTrendingConnect: SlackConnect = {
  slackHookUrl: slackEnv.slackHookUrl,
  slackChannel: slackEnv.slackTrendingChannel,
};

export default slackTrendingConnect;
