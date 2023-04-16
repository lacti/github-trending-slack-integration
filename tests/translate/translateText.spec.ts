import hasChinese from "../../src/support/hasChinese.js";
import translateText from "../../src/translate/translateText.js";

describe("translateText", () => {
  it("skip english", async () => {
    const result = await translateText("Hello, World!", {
      prefilter: hasChinese,
    });
    expect(result).toEqual("Hello, World!");
  });
  it("skip english and korean", async () => {
    const result = await translateText("Hello, 세계!", {
      prefilter: hasChinese,
    });
    expect(result).toEqual("Hello, 세계!");
  });
  it("should translate text", async () => {
    const result = await translateText("Hello, 世界!", {
      prefilter: hasChinese,
    });
    expect(result).toEqual("Hello world!");
  });
});
