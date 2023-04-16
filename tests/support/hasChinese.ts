import hasChinese from "../../src/support/hasChinese.js";

describe("hasChinese", () => {
  it("only english", () => {
    expect(hasChinese("Hello, World!")).toBe(false);
  });
  it("only korean", () => {
    expect(hasChinese("Hello, 세계!")).toBe(false);
  });
  it("only chinese", () => {
    expect(hasChinese("世界!")).toBe(true);
  });
  it("has chinese", () => {
    expect(hasChinese("Hello, 世界!")).toBe(true);
  });
});
