import reportOwner from "../src/reportOwner.js";
import slackTestConnect from "./slackTestConnect.js";

describe("reportOwner", () => {
  if (slackTestConnect) {
    it("should report owner", async () => {
      await reportOwner(
        {
          owner: "microsoft",
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
