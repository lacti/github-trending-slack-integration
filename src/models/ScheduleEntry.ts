import OwnerParameter from "./OwnerParameter.js";
import TrendingParameter from "./TrendingParameters.js";

export default interface ScheduleEntry {
  owners: OwnerParameter[];
  trendings: TrendingParameter[];
}
