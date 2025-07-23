import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

// Use vi.hoisted to ensure proper hoisting of mock variables
const { mockCurrentLocaleSet, mockNext } = vi.hoisted(() => ({
  mockCurrentLocaleSet: vi.fn(),
  mockNext: vi.fn(),
}));

vi.mock("astro:middleware", () => ({
  defineMiddleware: <T extends (...args: unknown[]) => unknown>(fn: T): T => fn,
}));

vi.mock("astro:config/client", () => ({
  i18n: {
    locales: ["en", "es", { codes: ["fr", "fr-CA"] }],
    defaultLocale: "en",
  },
}));

vi.mock("astro-nanostores-i18n:runtime", () => ({
  currentLocale: {
    set: mockCurrentLocaleSet,
  },
}));

import { onRequest } from "../src/middleware";

interface MockContext {
  url: {
    pathname: string;
  };
}

// Define a proper type for the middleware context
type MiddlewareContext = MockContext & Record<string, unknown>;

// Mock context object
const mockContext: MockContext = {
  url: {
    pathname: "",
  },
};

describe("middleware.ts", async () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should set the current locale based on the URL pathname", async () => {
    mockContext.url.pathname = "/es/some-page";
    await onRequest(mockContext as MiddlewareContext, mockNext);
    expect(mockCurrentLocaleSet).toHaveBeenCalledWith("es");
    expect(mockNext).toHaveBeenCalled();
  });

  it("should handle default locale when no locale in pathname", async () => {
    mockContext.url.pathname = "/some-page";
    await onRequest(mockContext as MiddlewareContext, mockNext);
    expect(mockCurrentLocaleSet).toHaveBeenCalledWith("en");
    expect(mockNext).toHaveBeenCalled();
  });

  it("should handle French locale", async () => {
    mockContext.url.pathname = "/fr/some-page";
    await onRequest(mockContext as MiddlewareContext, mockNext);
    expect(mockCurrentLocaleSet).toHaveBeenCalledWith("fr");
    expect(mockNext).toHaveBeenCalled();
  });

  it("should handle French Canadian locale", async () => {
    mockContext.url.pathname = "/fr-CA/some-page";
    await onRequest(mockContext as MiddlewareContext, mockNext);
    expect(mockCurrentLocaleSet).toHaveBeenCalledWith("fr-CA");
    expect(mockNext).toHaveBeenCalled();
  });
});
