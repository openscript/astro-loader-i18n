import { describe, expect, it } from "vitest";
import integration from "../src/integration";

describe("Integration Tests", () => {
  it("should have a valid integration export", () => {
    expect(integration).toBeDefined();
    expect(typeof integration).toBe("function");
  });
});
