import { describe, expect, it, vi, beforeEach } from "vitest";

describe("runtime.ts", () => {
  beforeEach(() => {
    vi.resetModules();
  });
  it("should have an empty current locale", async () => {
    const { currentLocale } = await vi.importActual<typeof import("../src/runtime.ts")>("../src/runtime.ts");
    expect(currentLocale.get()).toBe("");
  });
  it("should throw an error, if i18n was not initialized and used", async () => {
    const { useI18n } = await vi.importActual<typeof import("../src/runtime.ts")>("../src/runtime.ts");
    expect(() => useI18n("testComponent", {})).toThrowErrorMatchingSnapshot();
  });
  it("should set the current locale upon initialization of i18n", async () => {
    const { initializeI18n, currentLocale } = await vi.importActual<typeof import("../src/runtime.ts")>("../src/runtime.ts");
    initializeI18n("en", {});
    expect(currentLocale.get()).toBe("en");
  });
  it("should create return an i18n instance", async () => {
    const { initializeI18n, useI18n } = await vi.importActual<typeof import("../src/runtime.ts")>("../src/runtime.ts");
    initializeI18n("en", {});
    const i18n = useI18n("testComponent", { hello: "Hello" });
    expect(i18n).toBeDefined();
    expect(i18n).toEqual({ hello: "Hello" });
  });
});
