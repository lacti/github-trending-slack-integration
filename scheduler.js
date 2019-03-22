const report = require("./report-trending");

const defaultScheduler = {
  // 0: ['c++ weekly'],
  1: ["python weekly"],
  2: ["golang weekly"],
  3: ["dart weekly"],
  4: ["typescript weekly"],
  5: ["javascript weekly"]
  // 6: ['rust weekly'],
};
const scheduler = (() => {
  const scheduleInEnv = process.env["SCHEDULE"];
  if (scheduleInEnv) {
    try {
      return JSON.parse(scheduleInEnv);
    } catch (error) {
      console.error(`Invalid Schedule env`, scheduleInEnv, error);
    }
  }
  return defaultScheduler;
})();

const reportByScheduler = async () => {
  const today = scheduler[new Date().getDay()];
  if (today) {
    for (const [language, period] of today.map(each => each.split(/\s+/))) {
      console.log(language, period);
      await report(language, period);
    }
  }
};

if (require.main === module) {
  reportByScheduler();
}
