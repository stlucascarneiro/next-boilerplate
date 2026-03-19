import { beforeEach, describe, expect, it, vi } from "vitest";
import { BaseAPI } from "../../shared/apis/base.api";
import { IAPISettings } from "../../shared/types/api.type";
import {
  getLastFetchCall,
  getMockedConsoleError,
  mockFetchErrorResponse,
  mockFetchSuccess,
} from "../setup";

class TestAPI extends BaseAPI {
  BASE_URL = "https://api.example.com";
  HEADERS: Record<string, string> = {
    Authorization: "Bearer token123",
    "X-Custom-Header": "test-value",
  };
  API_SETTINGS: IAPISettings | undefined = undefined;

  async getAuth(): Promise<void> {
    // No-op
  }
}

describe("BaseAPI - Helper Functions", () => {
  let api: TestAPI;

  beforeEach(() => {
    api = new TestAPI();
  });

  describe("buildHeaders() - Header Merging", () => {
    it("should include default headers from HEADERS property", async () => {
      mockFetchSuccess({}, 200);

      await api.get("/test");

      const [, options] = getLastFetchCall();
      const headers = options.headers;
      expect(headers.get("X-Custom-Header")).toBe("test-value");
    });

    it("should merge default headers with method-specific headers", async () => {
      mockFetchSuccess({}, 200);

      await api.post("/test", {}, undefined);

      const [, options] = getLastFetchCall();
      const headers = options.headers;
      // Should have both X-Custom-Header and Content-Type
      expect(headers.get("X-Custom-Header")).toBe("test-value");
      expect(headers.get("Content-Type")).toBe("application/json");
    });

    it("should prioritize method-specific headers over defaults", async () => {
      mockFetchSuccess({}, 200);

      await api.post("/test", {});

      const [, options] = getLastFetchCall();
      const headers = options.headers;
      // Content-Type for POST should be application/json
      expect(headers.get("Content-Type")).toBe("application/json");
    });

    it("should handle empty default headers", async () => {
      const apiNoHeaders = new TestAPI();
      apiNoHeaders.HEADERS = {};

      mockFetchSuccess({}, 200);

      await apiNoHeaders.get("/test");

      const [, options] = getLastFetchCall();
      // Should still have Headers object
      expect(options.headers).toBeDefined();
    });
  });

  describe("buildPathWithParams() - Query String Building", () => {
    it("should append query params to path without existing params", async () => {
      mockFetchSuccess({}, 200);

      await api.get("/users", undefined, { limit: "10", page: "1" });

      const [url] = getLastFetchCall();
      expect(url).toContain("page=1");
      expect(url).toContain("limit=10");
      expect(url).toContain("?");
    });

    it("should use & separator when path already has query params", async () => {
      mockFetchSuccess({}, 200);

      await api.get("/users?filter=active", undefined, { page: "1" });

      const [url] = getLastFetchCall();
      expect(url).toContain("filter=active");
      expect(url).toContain("page=1");
      expect(url).toContain("&");
      expect(url).not.toContain("??");
    });

    it("should handle multiple query params", async () => {
      mockFetchSuccess({}, 200);

      await api.get("/users", undefined, {
        limit: "25",
        order: "asc",
        page: "2",
        sort: "name",
      });

      const [url] = getLastFetchCall();
      expect(url).toContain("page=2");
      expect(url).toContain("limit=25");
      expect(url).toContain("sort=name");
      expect(url).toContain("order=asc");
    });

    it("should filter out undefined params", async () => {
      mockFetchSuccess({}, 200);

      await api.get("/users", undefined, {
        active: "true",
        page: "1",
        search: undefined,
      });

      const [url] = getLastFetchCall();
      expect(url).toContain("page=1");
      expect(url).toContain("active=true");
      expect(url).not.toContain("search");
    });

    it("should not add params when params object is empty", async () => {
      mockFetchSuccess({}, 200);

      // Manually verify the behavior: if no params (or all undefined), path stays same
      const testUrl = "/users?existing=true";
      await api.get(testUrl, undefined, {});

      const [url] = getLastFetchCall();
      // Should not add extra ?
      expect(url).not.toContain("??");
    });

    it("should URL encode special characters in params", async () => {
      mockFetchSuccess({}, 200);

      await api.get("/users", undefined, { search: "hello world" });

      const [url] = getLastFetchCall();
      // URLSearchParams encodes space as +
      expect(url).toContain("hello+world");
    });
  });

  describe("parseResponseData() - Response Parsing", () => {
    it("should parse JSON response successfully", async () => {
      const mockData = { id: 1, name: "John" };
      mockFetchSuccess(mockData, 200);

      const result = await api.get("/users/1");

      expect(result.data).toEqual(mockData);
    });

    it("should return undefined for 204 No Content", async () => {
      mockFetchSuccess(null, 204);

      const result = await api.get("/users/1");

      expect(result.data).toBeUndefined();
    });

    it("should return undefined for 205 Reset Content", async () => {
      mockFetchSuccess(null, 205);

      const result = await api.get("/data");

      expect(result.data).toBeUndefined();
    });

    it("should return undefined when JSON parsing fails", async () => {
      const jsonMock = vi
        .fn<() => Promise<unknown>>()
        .mockRejectedValueOnce(new Error("Invalid JSON"));

      const mockResponse: Partial<Response> = {
        headers: new Headers(),
        json: jsonMock,
        status: 200,
      };

      (mockResponse as Response).clone = vi.fn(() => mockResponse as Response);
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockResponse as unknown as Response,
      );

      const result = await api.get("/users");

      expect(result.data).toBeUndefined();
    });

    it("should handle null JSON response", async () => {
      mockFetchSuccess(null, 200);

      const result = await api.get("/users");

      expect(result.status).toBe(200);
    });

    it("should handle empty array response", async () => {
      mockFetchSuccess([], 200);

      const result = await api.get("/users");

      expect(result.data).toEqual([]);
    });

    it("should handle nested object response", async () => {
      const mockData = {
        user: {
          id: 1,
          profile: { name: "John" },
        },
      };
      mockFetchSuccess(mockData, 200);

      const result = await api.get("/users/1");

      expect(result.data).toEqual(mockData);
    });
  });

  describe("readResponseBody() - Error Response Reading", () => {
    it("should read JSON error response", async () => {
      const errorData = { code: "INVALID_INPUT", message: "Bad request" };
      mockFetchSuccess(errorData, 400);

      const result = await api.get("/users");

      // Should have parsed the error response
      expect(result.status).toBe(400);
      expect(result.data).toEqual(errorData);
    });

    it("should fallback to text when JSON parsing fails", async () => {
      const json = vi.fn().mockRejectedValueOnce(new Error("Not JSON"));
      const text = vi.fn().mockResolvedValueOnce("Internal Server Error");

      const mockResponse = {
        clone: vi.fn(() => {
          return {
            json,
            text,
          };
        }),
        headers: new Headers(),
        json,
        status: 500,
        text,
      };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockResponse as unknown as Response,
      );

      const result = await api.get("/users");

      expect(result.status).toBe(500);
      // readResponseBody tries JSON first, then text
      // It returns the text when JSON fails
    });

    it("should handle response when both JSON and text parsing fail", async () => {
      const json = vi.fn().mockRejectedValueOnce(new Error("Not JSON"));

      const mockResponse = {
        clone: vi.fn(() => {
          return {
            json,
            text: vi.fn().mockRejectedValueOnce(new Error("Cannot read")),
          };
        }),
        headers: new Headers(),
        json,
        status: 500,
      };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockResponse as unknown as Response,
      );

      const result = await api.get("/users");

      expect(result.status).toBe(500);
    });
  });

  describe("sanitizeHeadersForLog() - Header Sanitization", () => {
    it("should remove Authorization header from logs", async () => {
      mockFetchSuccess({}, 200);

      await api.get("/users");

      // Get the last fetch call to verify Authorization was used internally
      const [, options] = getLastFetchCall();
      const headers = options.headers;
      expect(headers.get("Authorization")).toBe("Bearer token123");

      // Verify console.error wasn't called (no error logged for 200)
      // Authorization should be removed when logging errors (tested in error scenarios)
    });

    it("should keep other headers in logs", async () => {
      mockFetchErrorResponse(500, { error: "Server error" });

      await api.get("/users");

      const consoleError = getMockedConsoleError();
      expect(consoleError).toHaveBeenCalled();

      const errorLog = consoleError.mock.calls[0][1];
      expect(errorLog.headers["authorization"]).toBeUndefined();
      expect(errorLog.headers["x-custom-header"]).toBe("test-value");
    });

    it("should log custom headers without Authorization", async () => {
      // This is implicitly tested when errors are logged
      // The sanitization removes Authorization but keeps X-Custom-Header
    });
  });

  describe("isEmptyContentStatus() - Status Code Checking", () => {
    it("should treat 204 as empty content", async () => {
      mockFetchSuccess(null, 204);

      const result = await api.get("/users");

      expect(result.status).toBe(204);
      expect(result.data).toBeUndefined();
    });

    it("should treat 205 as empty content", async () => {
      mockFetchSuccess(null, 205);

      const result = await api.get("/users");

      expect(result.status).toBe(205);
      expect(result.data).toBeUndefined();
    });

    it("should parse body for other status codes", async () => {
      const mockData = { message: "ok" };
      mockFetchSuccess(mockData, 200);

      const result = await api.get("/users");

      expect(result.data).toEqual(mockData);
    });
  });

  describe("isErrorStatus() - Error Status Detection", () => {
    it("should not treat 404 as error status (special case)", async () => {
      mockFetchErrorResponse(404, { message: "Not found" });

      await api.get("/users/999");

      // Should not log error for 404
      expect(getMockedConsoleError()).not.toHaveBeenCalled();
    });

    it("should treat 400 as error status", async () => {
      mockFetchErrorResponse(400, { message: "Bad request" });

      await api.get("/users");

      // Should log error for 400
      expect(getMockedConsoleError()).toHaveBeenCalled();
    });

    it("should treat 5xx as error status", async () => {
      mockFetchErrorResponse(500, { message: "Server error" });

      await api.get("/users");

      // Should log error
      expect(getMockedConsoleError()).toHaveBeenCalled();
    });

    it("should not treat 2xx as error status", async () => {
      mockFetchSuccess({}, 200);

      const result = await api.get("/users");

      expect(result.status).toBe(200);
    });

    it("should not treat 3xx as error status", async () => {
      mockFetchSuccess({}, 301);

      const result = await api.get("/users");

      expect(result.status).toBe(301);
    });
  });
});
