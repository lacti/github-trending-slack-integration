import OwnerParameter from "./OwnerParameter";
import TrendingParameter from "./TrendingParameters";

export default interface ScheduleEntry {
  owners: OwnerParameter[];
  trendings: TrendingParameter[];
}
