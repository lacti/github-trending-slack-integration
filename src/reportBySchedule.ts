import SlackConnect from "./models/SlackConnect.js";
import mergeUnique from "./support/mergeUnique.js";
import reportOwner from "./reportOwner.js";
import reportTrending from "./reportTrending.js";
import scheduleTable from "./env/scheduleTable.js";
import sendToSlack from "./support/sendToSlack.js";
import slackOwnerConnect from "./env/slackOwnerConnect.js";

export default async function reportBySchedule({
  watchTrending,
  watchOwner,
  slackConnect,
}: {
  watchTrending: boolean;
  watchOwner: boolean;
  slackConnect: SlackConnect;
}): Promise<void> {
  const paramsFromAll = scheduleTable.all;
  const paramsFromDay = scheduleTable[new Date().getDay()];
  if (watchTrending) {
    await reportDelegate(
      slackConnect,
      reportTrending,
      mergeUnique({
        first: paramsFromDay?.trendings,
        second: paramsFromAll?.trendings,
        asKey: (input) => input.language ?? "any",
      })
    );
  }
  if (watchOwner) {
    await reportDelegate(
      slackOwnerConnect,
      reportOwner,
      mergeUnique({
        first: paramsFromDay?.owners,
        second: paramsFromAll?.owners,
        asKey: (input) => input.owner,
      })
    );
  }
}

async function reportDelegate<T>(
  slackConnect: SlackConnect,
  report: (each: T, slackConnect: SlackConnect) => Promise<unknown>,
  input: T[]
) {
  for (const each of input) {
    console.info({ each }, "Report");
    const result = await report(each, slackConnect);
    console.info({ each, result }, "Report is completed");
  }
  await sendToSlack(slackConnect, {
    text: "<!channel> OK, now you see me :)",
  });
}
