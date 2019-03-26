const report = require("./report");

const defaultTable = {
  // 0: ['c++ weekly'],
  1: ["python weekly"],
  2: ["golang weekly"],
  3: ["dart weekly"],
  4: ["typescript weekly"],
  5: ["javascript weekly"]
  // 6: ['rust weekly'],
};
const table = (() => {
  const scheduleInEnv = process.env["SCHEDULE"];
  if (scheduleInEnv) {
    try {
      return JSON.parse(scheduleInEnv);
    } catch (error) {
      console.error(`Invalid Schedule env`, scheduleInEnv, error);
    }
  }
  return defaultTable;
})();

const reportByTable = async () => {
  const today = table[new Date().getDay()];
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
