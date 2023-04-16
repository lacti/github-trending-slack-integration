import Days from "./Days.js";
import ScheduleEntry from "./ScheduleEntry.js";

type Schedule = {
  [K in keyof typeof Days]?: ScheduleEntry;
};

export default Schedule;
