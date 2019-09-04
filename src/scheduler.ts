import report, { ITrendingParameters } from "./report";

enum Days {
  all,
  mon,
  tue,
  wed,
  thu,
  fri,
  sat,
  sun
}

type ISchedule = {
  [K in keyof typeof Days]?: ITrendingParameters[];
};

const table: ISchedule = (() => {
  const scheduleInEnv = process.env.SCHEDULE;
  if (!scheduleInEnv) {
    console.error(`There is no SCHEDULE env.`, scheduleInEnv);
    throw new Error("Please set SCHEDULE env.");
  }
  try {
    return JSON.parse(scheduleInEnv);
  } catch (error) {
    console.error(`Invalid Schedule env`, scheduleInEnv, error);
    throw error;
  }
})();

const reportByTable = async () => {
  const today: ISchedule[Days] = [
    ...(table.all || []),
    ...(table[new Date().getDay()] || [])
  ];
  if (!today) {
    return {};
  }
  const result: Array<ITrendingParameters & { response: string }> = [];
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
  return { table, result };
};

export default reportByTable;

if (require.main === module) {
  reportByTable()
    .then(console.log)
    .catch(error => console.error(`Something is wrong`, error));
}
