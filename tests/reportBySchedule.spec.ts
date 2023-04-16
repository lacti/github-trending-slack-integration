import reportBySchedule from "../src/reportBySchedule.js";
import slackTestConnect from "./slackTestConnect.js";

describe("reportBySchedule", () => {
  if (slackTestConnect) {
    it("should report all", async () => {
      await reportBySchedule({
        watchTrending: true,
        watchOwner: true,
        slackConnect: slackTestConnect!,
      });
    });
  } else {
    it("skip due to no env", () => {
      expect(true).toBe(true);
    });
  }
});
