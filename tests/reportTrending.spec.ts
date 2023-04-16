import reportTrending from "../src/reportTrending.js";
import slackTestConnect from "./slackTestConnect.js";

describe("reportTrending", () => {
  if (slackTestConnect) {
    it("should report trending", async () => {
      await reportTrending(
        {
          language: "javascript",
          period: "today",
        },
        slackTestConnect!
      );
    });
  } else {
    it("skip due to no env", () => {
      expect(true).toBe(true);
    });
  }
});
