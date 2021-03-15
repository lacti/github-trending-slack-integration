import SlackConnect from "./models/SlackConnect";
import mergeUnique from "./support/mergeUnique";
import reportOwner from "./reportOwner";
import reportTrending from "./reportTrending";
import scheduleTable from "./env/scheduleTable";
import sendToSlack from "./support/sendToSlack";
import slackOwnerConnect from "./env/slackOwnerConnect";
import slackTrendingConnect from "./env/slackTrendingConnect";

export default async function reportBySchedule({
  watchTrending = true,
  watchOwner = true,
}: { watchTrending?: boolean; watchOwner?: boolean } = {}): Promise<void> {
  const paramsFromAll = scheduleTable.all;
  const paramsFromDay = scheduleTable[new Date().getDay()];
  if (watchTrending) {
    await reportDelegate(
      slackTrendingConnect,
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

if (require.main === module) {
  reportBySchedule({
    watchTrending: process.argv[2] === "true",
    watchOwner: process.argv[3] === "true",
  })
    .then(console.info)
    .catch(console.error);
}
