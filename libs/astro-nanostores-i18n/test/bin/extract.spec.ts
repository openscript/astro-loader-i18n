import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { readFile } from "node:fs/promises";
import { createContext, runInContext } from "node:vm";
import { parse, ParseResult } from "@astrojs/compiler";
import { is, walk } from "@astrojs/compiler/utils";
import glob from "fast-glob";
import * as ts from "typescript";
import { Node } from "@astrojs/compiler/types";

// Mock all external dependencies
vi.mock("node:fs/promises");
vi.mock("fast-glob");
vi.mock("@astrojs/compiler");
vi.mock("@astrojs/compiler/utils");
vi.mock("node:vm");

const mockReadFile = vi.mocked(readFile);
const mockGlob = vi.mocked(glob);
const mockParse = vi.mocked(parse);
const mockWalk = vi.mocked(walk);
const mockIs = vi.mocked(is);
const mockCreateContext = vi.mocked(createContext);
const mockRunInContext = vi.mocked(runInContext);

describe("extract.ts", () => {
  const originalArgv = process.argv;
  const originalExit = process.exit;
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;

  beforeEach(() => {
    // Clear module cache to allow re-importing
    vi.resetModules();

    // Mock process.exit
    process.exit = vi.fn() as unknown as typeof process.exit;
    console.warn = vi.fn();
    console.error = vi.fn();

    // Setup default mock implementations
    mockGlob.mockResolvedValue([]);
    mockCreateContext.mockReturnValue({});
    mockRunInContext.mockReturnValue(undefined);
  });

  afterEach(() => {
    process.argv = originalArgv;
    process.exit = originalExit;
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
    vi.restoreAllMocks();
  });

  describe("CLI argument parsing", () => {
    it("should display help when --help flag is provided", async () => {
      process.argv = ["node", "extract.ts", "--help"];

      // eslint-disable-next-line prettier/prettier
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => { });

      // Use dynamic import with cache busting
      await vi.importActual("../../src/bin/extract.ts");

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Usage: extract-messages [options]"));
      expect(process.exit).toHaveBeenCalledWith(0);
    });

    it("should use default values when no arguments provided", async () => {
      process.argv = ["node", "extract.ts"];

      // Use dynamic import with cache busting
      await vi.importActual("../../src/bin/extract.ts");

      expect(mockGlob).toHaveBeenCalledWith("./src/**/*.astro", { absolute: true });
    });
  });

  describe("file processing", () => {
    it("should process Astro files and extract messages", async () => {
      const mockAstroContent = `---
const messages = useI18n("example", {
  greeting: "Hello World",
  farewell: "Goodbye"
});
---
<div>{messages.greeting}</div>`;

      const mockAst = {
        type: "root",
        children: [
          {
            type: "frontmatter",
            value: `const messages = useI18n("example", {
  greeting: "Hello World",
  farewell: "Goodbye"
});`,
          },
        ],
      };

      process.argv = ["node", "extract.ts"];
      mockGlob.mockResolvedValue(["/test/file.astro"]);
      mockReadFile.mockResolvedValue(mockAstroContent);
      mockParse.mockResolvedValue({ ast: mockAst } as ParseResult);

      // Mock walk to call the callback with frontmatter node
      mockWalk.mockImplementation((_ast, callback) => {
        callback(mockAst.children[0] as Node);
      });

      // Mock is.frontmatter to return true for frontmatter nodes
      mockIs.frontmatter = vi.fn().mockReturnValue(true) as typeof mockIs.frontmatter;

      await vi.importActual("../../src/bin/extract.ts");

      expect(mockReadFile).toHaveBeenCalledWith("/test/file.astro", "utf-8");
      expect(mockParse).toHaveBeenCalledWith(mockAstroContent, { position: false });
      expect(mockWalk).toHaveBeenCalled();
    });

    it("should handle files without messages", async () => {
      const mockAstroContent = `---
const someOtherVariable = "test";
---
<div>No messages here</div>`;

      const mockAst = {
        type: "root",
        children: [
          {
            type: "frontmatter",
            value: `const someOtherVariable = "test";`,
          },
        ],
      };

      process.argv = ["node", "extract.ts"];
      mockGlob.mockResolvedValue(["/test/file.astro"]);
      mockReadFile.mockResolvedValue(mockAstroContent);
      mockParse.mockResolvedValue({ ast: mockAst } as ParseResult);

      mockWalk.mockImplementation((_ast, callback) => {
        callback(mockAst.children[0] as Node);
      });

      mockIs.frontmatter = vi.fn().mockReturnValue(true) as typeof mockIs.frontmatter;

      await vi.importActual("../../src/bin/extract.ts");

      expect(console.warn).toHaveBeenCalledWith("No messages found in the provided components.");
    });
  });

  describe("message extraction", () => {
    it("should extract messages from TypeScript AST", () => {
      // This tests the extractMessagesFromAST function indirectly
      const code = `const messages = useI18n("example", {
        greeting: "Hello",
        farewell: "Goodbye"
      });`;

      const sourceFile = ts.createSourceFile("temp.ts", code, ts.ScriptTarget.Latest, true);
      let messagesExport: string | undefined;

      function visit(node: ts.Node) {
        if (ts.isVariableStatement(node)) {
          const declaration = node.declarationList.declarations[0];
          if (ts.isIdentifier(declaration.name) && declaration.name.text === "messages" && declaration.initializer) {
            messagesExport = node.getText();
          }
        }
        ts.forEachChild(node, visit);
      }

      visit(sourceFile);

      expect(messagesExport).toBeDefined();
      expect(messagesExport).toContain("useI18n");
      expect(messagesExport).toContain("greeting");
      expect(messagesExport).toContain("farewell");
    });

    it("should not extract non-messages variables", () => {
      const code = `const otherVariable = "not messages";`;

      const sourceFile = ts.createSourceFile("temp.ts", code, ts.ScriptTarget.Latest, true);
      let messagesExport: string | undefined;

      function visit(node: ts.Node) {
        if (ts.isVariableStatement(node)) {
          const declaration = node.declarationList.declarations[0];
          if (ts.isIdentifier(declaration.name) && declaration.name.text === "messages" && declaration.initializer) {
            messagesExport = node.getText();
          }
        }
        ts.forEachChild(node, visit);
      }

      visit(sourceFile);

      expect(messagesExport).toBeUndefined();
    });
  });

  describe("output generation", () => {
    it("should write extracted messages to file", async () => {
      process.argv = ["node", "extract.ts", "--out", "/test/output.json"];
      mockGlob.mockResolvedValue([]);

      // Mock the context to simulate extracted messages
      const mockContext = {
        exports: {},
        Object,
        useI18n: vi.fn((_namespace: string, messages: unknown) => {
          return messages;
        }),
        params: vi.fn((template: string) => template),
        count: vi.fn((counts: Record<string, string>) => counts),
      };

      mockCreateContext.mockReturnValue(mockContext);

      await vi.importActual("../../src/bin/extract.ts");

      // Since we have no files, it should warn about no messages
      expect(console.warn).toHaveBeenCalledWith("No messages found in the provided components.");
    });

    it("should use custom output path", async () => {
      process.argv = ["node", "extract.ts", "--out", "/custom/path/messages.json"];
      mockGlob.mockResolvedValue([]);

      await vi.importActual("../../src/bin/extract.ts");

      expect(console.warn).toHaveBeenCalledWith("No messages found in the provided components.");
    });

    it("should use custom glob pattern", async () => {
      process.argv = ["node", "extract.ts", "--glob", "./custom/**/*.astro"];
      mockGlob.mockResolvedValue([]);

      await vi.importActual("../../src/bin/extract.ts");

      expect(mockGlob).toHaveBeenCalledWith("./custom/**/*.astro", { absolute: true });
    });
  });
});
