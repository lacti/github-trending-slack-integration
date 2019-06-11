const report = require("./report");

const table = (() => {
  const scheduleInEnv = process.env["SCHEDULE"];
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
  const today = [...(table["*"] || []), ...(table[new Date().getDay()] || [])];
  if (!today) {
    return {};
  }
  const result = {};
  for (const each of today) {
    const [language, period] = each.split(/\s+/);
    console.log(language, period);
    try {
      result[each] = await report(language, period);
    } catch (error) {
      console.error(`Error in ${each}`, error);
      result[each] = error.message;
    }
  }
  return { table, result };
};
module.exports = reportByTable;

if (require.main === module) {
  reportByTable()
    .then(console.log)
    .catch(error => console.error(`Something is wrong`, error));
}
