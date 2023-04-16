import Schedule from "../models/Schedule.js";

const scheduleTable: Schedule = (function () {
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

export default scheduleTable;
