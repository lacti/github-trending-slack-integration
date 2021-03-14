import mergeUnique from "./support/mergeUnique";
import reportOwner from "./reportOwner";
import reportTrending from "./reportTrending";
import scheduleTable from "./env/scheduleTable";

export default async function reportBySchedule(): Promise<void> {
  const paramsFromAll = scheduleTable.all;
  const paramsFromDay = scheduleTable[new Date().getDay()];
  const trendings = mergeUnique({
    first: paramsFromDay?.trendings,
    second: paramsFromAll?.trendings,
    asKey: (input) => input.language ?? "any",
  });
  for (const trending of trendings) {
    console.info({ trending }, "Report trending");
    const result = await reportTrending(trending);
    console.info({ trending, result }, "Report trending is completed");
  }
  const owners = mergeUnique({
    first: paramsFromDay?.owners,
    second: paramsFromAll?.owners,
    asKey: (input) => input.owner,
  });
  for (const owner of owners) {
    console.info({ owner }, "Report owner");
    const result = await reportOwner(owner);
    console.info({ owner, result }, "Report owner is completed");
  }
}

if (require.main === module) {
  reportBySchedule().then(console.info).catch(console.error);
}
