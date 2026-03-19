import { beforeEach, describe, expect, it, vi } from "vitest";
import { BaseAPI } from "../../shared/apis/base.api";
import {
  getLastFetchCall,
  getMockedConsoleError,
  mockFetchErrorResponse,
  mockFetchSuccess,
} from "../setup";

class TestAPI extends BaseAPI {
  BASE_URL = "https://api.example.com";
  HEADERS = {
    Authorization: "Bearer secret-token-123",
    "X-Custom-Header": "test",
  };
  API_SETTINGS = undefined;

  getAuthCallCount = 0;

  async getAuth(): Promise<void> {
    this.getAuthCallCount++;
  }
}

describe("BaseAPI - Auth & Logging", () => {
  let api: TestAPI;

  beforeEach(() => {
    api = new TestAPI();
    api.getAuthCallCount = 0;
  });

  describe("Auth Execution", () => {
    it("should call getAuth() before GET request", async () => {
      mockFetchSuccess({}, 200);

      await api.get("/users");

      expect(api.getAuthCallCount).toBe(1);
    });

    it("should call getAuth() before POST request", async () => {
      mockFetchSuccess({}, 201);

      await api.post("/users", { name: "John" });

      expect(api.getAuthCallCount).toBe(1);
    });

    it("should call getAuth() before PATCH request", async () => {
      mockFetchSuccess({}, 200);

      await api.patch("/users/1", { name: "Jane" });

      expect(api.getAuthCallCount).toBe(1);
    });

    it("should call getAuth() before DELETE request", async () => {
      mockFetchSuccess({}, 200);

      await api.delete("/users/1");

      expect(api.getAuthCallCount).toBe(1);
    });

    it("should call getAuth() before FormData upload", async () => {
      mockFetchSuccess({}, 200);

      const formData = new FormData();
      await api.sendFormData("/upload", formData);

      expect(api.getAuthCallCount).toBe(1);
    });

    it("should call getAuth() once per request", async () => {
      mockFetchSuccess({}, 200);

      await api.get("/users");
      expect(api.getAuthCallCount).toBe(1);

      await api.get("/posts");
      expect(api.getAuthCallCount).toBe(2);

      await api.post("/items", {});
      expect(api.getAuthCallCount).toBe(3);
    });

    it("should call getAuth() even if it throws an error", async () => {
      const apiWithErrorAuth = new TestAPI();
      let authCalled = false;

      apiWithErrorAuth.getAuth = vi.fn(async () => {
        authCalled = true;
        throw new Error("Auth failed");
      });

      mockFetchSuccess({}, 200);

      // Even if getAuth throws, request should continue (or fail appropriately)
      // The implementation catches and passes through
      try {
        await apiWithErrorAuth.get("/users");
      } catch {
        // Expected if getAuth throws
      }

      expect(authCalled).toBe(true);
    });
  });

  describe("Authorization Header in Requests", () => {
    it("should include Authorization header in requests", async () => {
      mockFetchSuccess({}, 200);

      await api.get("/users");

      const [, options] = getLastFetchCall();
      const headers = options.headers;
      expect(headers.get("Authorization")).toBe("Bearer secret-token-123");
    });

    it("should include Authorization in POST requests", async () => {
      mockFetchSuccess({}, 201);

      await api.post("/users", { name: "John" });

      const [, options] = getLastFetchCall();
      const headers = options.headers;
      expect(headers.get("Authorization")).toBe("Bearer secret-token-123");
    });

    it("should include Authorization in all request types", async () => {
      mockFetchSuccess({}, 200);

      // Test multiple request types
      await api.get("/test1");
      const headers1 = getLastFetchCall()[1].headers;
      expect(headers1.get("Authorization")).toBeTruthy();

      await api.post("/test2", {});
      const headers2 = getLastFetchCall()[1].headers;
      expect(headers2.get("Authorization")).toBeTruthy();

      await api.patch("/test3", {});
      const headers3 = getLastFetchCall()[1].headers;
      expect(headers3.get("Authorization")).toBeTruthy();

      await api.delete("/test4");
      const headers4 = getLastFetchCall()[1].headers;
      expect(headers4.get("Authorization")).toBeTruthy();
    });
  });

  describe("Error Logging with Sanitization", () => {
    it("should log 4xx errors (excluding 404)", async () => {
      mockFetchErrorResponse(400, { message: "Bad request" });

      await api.get("/users");

      const consoleError = getMockedConsoleError();
      expect(consoleError).toHaveBeenCalled();
    });

    it("should log 5xx errors", async () => {
      mockFetchErrorResponse(500, { message: "Server error" });

      await api.get("/users");

      const consoleError = getMockedConsoleError();
      expect(consoleError).toHaveBeenCalled();
    });

    it("should log error with request details", async () => {
      mockFetchErrorResponse(500, { message: "Server error" });

      await api.get("/users");

      const consoleError = getMockedConsoleError();
      expect(consoleError).toHaveBeenCalled();

      // The error log should include request details
      const errorCall = consoleError.mock.calls[0];
      expect(errorCall[0]).toContain("TestAPI");
      expect(errorCall[0]).toContain("Request error");
    });

    it("should include response status in error log", async () => {
      mockFetchErrorResponse(503, { message: "Service unavailable" });

      await api.get("/users");

      const consoleError = getMockedConsoleError();
      expect(consoleError).toHaveBeenCalled();

      const errorLog = consoleError.mock.calls[0][1];
      expect(errorLog.status).toBe(503);
    });

    it("should include request URL in error log", async () => {
      mockFetchErrorResponse(500, { error: "Server error" });

      await api.get("/api/users");

      const consoleError = getMockedConsoleError();
      expect(consoleError).toHaveBeenCalled();

      const errorLog = consoleError.mock.calls[0][1];
      expect(errorLog.url).toContain("/api/users");
    });

    it("should include request method in error log", async () => {
      mockFetchErrorResponse(500, { error: "Server error" });

      await api.post("/users", { name: "John" });

      const consoleError = getMockedConsoleError();
      expect(consoleError).toHaveBeenCalled();

      const errorLog = consoleError.mock.calls[0][1];
      expect(errorLog.method).toBe("POST");
    });

    it("should include response body in error log", async () => {
      const errorBody = { field: "email", message: "Validation failed" };
      mockFetchErrorResponse(400, errorBody);

      await api.post("/users", { name: "Test" });

      const consoleError = getMockedConsoleError();
      expect(consoleError).toHaveBeenCalled();

      const errorLog = consoleError.mock.calls[0][1];
      expect(errorLog.response).toEqual(errorBody);
    });

    it("should sanitize Authorization header from logs", async () => {
      mockFetchErrorResponse(401, { message: "Unauthorized" });

      await api.get("/users");

      const consoleError = getMockedConsoleError();
      expect(consoleError).toHaveBeenCalled();

      const errorLog = consoleError.mock.calls[0][1];
      const headers = errorLog.headers;

      // Authorization should not be in logged headers
      if (headers && headers.Authorization) {
        throw new Error("Authorization header should be sanitized from logs");
      }
    });

    it("should keep other headers in error logs", async () => {
      mockFetchErrorResponse(500, { message: "Server error" });

      await api.get("/users");

      const consoleError = getMockedConsoleError();
      expect(consoleError).toHaveBeenCalled();

      const errorLog = consoleError.mock.calls[0][1];
      const headers = errorLog.headers;

      // X-Custom-Header should be present
      expect(headers).toHaveProperty("x-custom-header", "test");
    });

    it("should not log 404 errors", async () => {
      mockFetchErrorResponse(404, { message: "Not found" });

      await api.get("/users/999");

      const consoleError = getMockedConsoleError();
      // 404 should not be logged as an error
      // Check that error wasn't logged for 404
      const errorCalls = consoleError.mock.calls.filter((call) => {
        const message = call[0];
        return message && message.includes("Request error");
      });

      // 404 is not considered an error status, so shouldn't log
      expect(errorCalls.length).toBe(0);
    });

    it("should handle 403 Forbidden as error", async () => {
      mockFetchErrorResponse(403, { message: "Forbidden" });

      await api.get("/admin");

      const consoleError = getMockedConsoleError();
      expect(consoleError).toHaveBeenCalled();
    });
  });

  describe("Network Error Logging", () => {
    it("should log network errors", async () => {
      const networkError = new Error("Connection timeout");
      vi.mocked(global.fetch).mockRejectedValueOnce(networkError);

      await api.get("/users");

      const consoleError = getMockedConsoleError();
      expect(consoleError).toHaveBeenCalled();
    });

    it("should include error message in network error log", async () => {
      const networkError = new Error("ECONNREFUSED");
      vi.mocked(global.fetch).mockRejectedValueOnce(networkError);

      await api.get("/users");

      const consoleError = getMockedConsoleError();
      expect(consoleError).toHaveBeenCalled();

      const errorLog = consoleError.mock.calls[0][1];
      expect(errorLog.error).toContain("ECONNREFUSED");
    });

    it("should include request URL in network error log", async () => {
      const networkError = new Error("Timeout");
      vi.mocked(global.fetch).mockRejectedValueOnce(networkError);

      await api.post("/api/submit", { data: "test" });

      const consoleError = getMockedConsoleError();
      expect(consoleError).toHaveBeenCalled();

      const errorLog = consoleError.mock.calls[0][1];
      expect(errorLog.url).toContain("/api/submit");
    });
  });

  describe("Logging Label", () => {
    it("should use class name in log label", async () => {
      mockFetchErrorResponse(500, { message: "Error" });

      await api.get("/users");

      const consoleError = getMockedConsoleError();
      expect(consoleError).toHaveBeenCalled();

      const logMessage = consoleError.mock.calls[0][0];
      expect(logMessage).toContain("TestAPI");
    });
  });
});
