import Days from "./Days";
import TrendingParameters from "./TrendingParameters";

type Schedule = {
  [K in keyof typeof Days]?: TrendingParameters[];
};

export default Schedule;
