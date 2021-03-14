import Days from "./Days";
import ScheduleEntry from "./ScheduleEntry";

type Schedule = {
  [K in keyof typeof Days]?: ScheduleEntry;
};

export default Schedule;
