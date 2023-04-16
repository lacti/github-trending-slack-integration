import readTrending from "../src/readTrending.js";

describe("readTrending", () => {
  it("javascript", async () => {
    const result = await readTrending({
      language: "javascript",
      period: "today",
    });
    console.info(result);
    expect(result.length).toBeGreaterThan(0);
  });
});
