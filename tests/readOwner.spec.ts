import readOwner from "../src/readOwner.js";

describe("readOwner", () => {
  it("microsoft", async () => {
    const result = await readOwner({ owner: "microsoft" });
    console.info(result);
    expect(result.length).toBeGreaterThan(0);
  });
});
