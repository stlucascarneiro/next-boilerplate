import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type MockInstance,
  vi,
} from "vitest";
import { Logger } from "../../shared/services/logger";

describe("Logger", () => {
  let mockConsoleError: MockInstance<(...args: unknown[]) => void>;
  let mockConsoleInfo: MockInstance<(...args: unknown[]) => void>;
  let mockConsoleWarn: MockInstance<(...args: unknown[]) => void>;

  beforeEach(() => {
    mockConsoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    mockConsoleInfo = vi.spyOn(console, "info").mockImplementation(() => {});
    mockConsoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    mockConsoleError.mockRestore();
    mockConsoleInfo.mockRestore();
    mockConsoleWarn.mockRestore();
  });

  describe("Logger.error()", () => {
    it("should call console.error with formatted log", () => {
      Logger.error({
        label: "MyClass",
        message: "Something went wrong",
      });

      expect(mockConsoleError).toHaveBeenCalledWith(
        "[MyClass] Something went wrong",
      );
      expect(mockConsoleError).toHaveBeenCalledTimes(1);
    });

    it("should call console.error with object when provided", () => {
      const errorObj = { code: 500, details: "Server error" };
      Logger.error({
        label: "API",
        message: "Request failed",
        object: errorObj,
      });

      expect(mockConsoleError).toHaveBeenCalledWith(
        "[API] Request failed",
        errorObj,
      );
      expect(mockConsoleError).toHaveBeenCalledTimes(1);
    });

    it("should call console.error without object when not provided", () => {
      Logger.error({
        label: "Test",
        message: "Test message",
      });

      expect(mockConsoleError).toHaveBeenCalledWith("[Test] Test message");
      // Should be called only once (not with undefined as second argument)
      expect(mockConsoleError).toHaveBeenCalledTimes(1);
    });
  });

  describe("Logger.info()", () => {
    it("should call console.info with formatted log", () => {
      Logger.info({
        label: "MyClass",
        message: "Operation successful",
      });

      expect(mockConsoleInfo).toHaveBeenCalledWith(
        "[MyClass] Operation successful",
      );
      expect(mockConsoleInfo).toHaveBeenCalledTimes(1);
    });

    it("should call console.info with object when provided", () => {
      const data = { timestamp: "2026-03-18", userId: 123 };
      Logger.info({
        label: "Database",
        message: "Record created",
        object: data,
      });

      expect(mockConsoleInfo).toHaveBeenCalledWith(
        "[Database] Record created",
        data,
      );
      expect(mockConsoleInfo).toHaveBeenCalledTimes(1);
    });
  });

  describe("Logger.warn()", () => {
    it("should call console.warn with formatted log", () => {
      Logger.warn({
        label: "MyClass",
        message: "This is a warning",
      });

      expect(mockConsoleWarn).toHaveBeenCalledWith(
        "[MyClass] This is a warning",
      );
      expect(mockConsoleWarn).toHaveBeenCalledTimes(1);
    });

    it("should call console.warn with object when provided", () => {
      const warnData = { alternative: "API v2", deprecation: "API v1" };
      Logger.warn({
        label: "API",
        message: "Deprecated endpoint",
        object: warnData,
      });

      expect(mockConsoleWarn).toHaveBeenCalledWith(
        "[API] Deprecated endpoint",
        warnData,
      );
      expect(mockConsoleWarn).toHaveBeenCalledTimes(1);
    });
  });

  describe("Formatting", () => {
    it("should format label and message correctly", () => {
      Logger.error({
        label: "BaseAPI",
        message: "Network error",
      });

      const call = mockConsoleError.mock.calls[0][0];
      expect(call).toMatch(/^\[BaseAPI\]/);
      expect(call).toContain("Network error");
    });

    it("should handle special characters in label and message", () => {
      Logger.info({
        label: "Test-Class:V2",
        message: "Message with special chars: !@#$%",
      });

      const call = mockConsoleInfo.mock.calls[0][0];
      expect(call).toContain("Test-Class:V2");
      expect(call).toContain("!@#$%");
    });
  });
});
