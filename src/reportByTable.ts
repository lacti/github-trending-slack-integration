import Days from "./models/Days";
import Schedule from "./models/Schedule";
import TrendingParameters from "./models/TrendingParameters";
import report from "./report";
import scheduleTable from "./env/scheduleTable";

export default async function reportByTable() {
  const today: Schedule[Days] = [
    ...(scheduleTable.all || []),
    ...(scheduleTable[new Date().getDay()] || []),
  ];
  if (!today) {
    return {};
  }
  const result: Array<TrendingParameters & { response: string }> = [];
  for (const params of today) {
    console.info(`Report`, params);
    let response: string;
    try {
      response = await report(params);
    } catch (error) {
      console.error(`Error`, params, error);
      response = error.message;
    }
    result.push({ ...params, response });
  }
  return { table: scheduleTable, result };
}

if (require.main === module) {
  reportByTable()
    .then(console.info)
    .catch((error) => console.error(`Something is wrong`, error));
}
