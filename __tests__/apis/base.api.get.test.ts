import { beforeEach, describe, expect, it, vi } from "vitest";
import { BaseAPI } from "../../shared/apis/base.api";
import {
  getLastFetchCall,
  getMockedConsoleError,
  mockFetchError,
  mockFetchErrorResponse,
  mockFetchSuccess,
} from "../setup";

/**
 * Concrete implementation of BaseAPI for testing
 */
class TestAPI extends BaseAPI {
  BASE_URL = "https://api.example.com";
  HEADERS = { "X-Custom-Header": "test" };
  API_SETTINGS = undefined;

  async getAuth(): Promise<void> {
    // No-op for testing
  }
}

describe("BaseAPI - GET Method", () => {
  let api: TestAPI;

  beforeEach(() => {
    api = new TestAPI();
  });

  describe("Happy Path", () => {
    it("should fetch data successfully", async () => {
      const mockData = { id: 1, name: "John" };
      mockFetchSuccess(mockData, 200);

      const result = await api.get("/users/1");

      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockData);
    });

    it("should construct full URL correctly", async () => {
      mockFetchSuccess({}, 200);

      await api.get("/users");

      const [url] = getLastFetchCall();
      expect(url).toBe("https://api.example.com/users");
    });

    it("should include default headers in request", async () => {
      mockFetchSuccess({}, 200);

      await api.get("/users");

      const [, options] = getLastFetchCall();
      const headers = options.headers as Headers;
      expect(headers.get("X-Custom-Header")).toBe("test");
    });

    it("should set method to GET", async () => {
      mockFetchSuccess({}, 200);

      await api.get("/users");

      const [, options] = getLastFetchCall();
      expect(options.method).toBe("GET");
    });
  });

  describe("Query Parameters", () => {
    it("should add query parameters to URL", async () => {
      mockFetchSuccess({}, 200);

      await api.get("/users", undefined, { limit: 10, page: 1 });

      const [url] = getLastFetchCall();
      expect(url).toContain("page=1");
      expect(url).toContain("limit=10");
    });

    it("should filter out undefined parameters", async () => {
      mockFetchSuccess({}, 200);

      await api.get("/users", undefined, { page: 1, search: undefined });

      const [url] = getLastFetchCall();
      expect(url).toContain("page=1");
      expect(url).not.toContain("search");
    });

    it("should handle multiple parameters", async () => {
      mockFetchSuccess({}, 200);

      await api.get("/users", undefined, {
        active: true,
        limit: 20,
        page: 2,
        sort: "name",
      });

      const [url] = getLastFetchCall();
      expect(url).toContain("page=2");
      expect(url).toContain("limit=20");
      expect(url).toContain("sort=name");
      expect(url).toContain("active=true");
    });

    it("should handle URL that already has query params", async () => {
      mockFetchSuccess({}, 200);

      await api.get("/users?existing=true", undefined, { page: 1 });

      const [url] = getLastFetchCall();
      expect(url).toContain("existing=true");
      expect(url).toContain("page=1");
      expect(url).toContain("&"); // Should use & separator
    });
  });

  describe("Revalidation/Cache", () => {
    it("should set default revalidation time (600s)", async () => {
      mockFetchSuccess({}, 200);

      await api.get("/users");

      const [, options] = getLastFetchCall();
      expect(options.next).toEqual({
        revalidate: 600,
        tags: undefined,
      });
    });

    it("should use custom revalidation time", async () => {
      mockFetchSuccess({}, 200);

      await api.get("/users", { revalidateTime: 3600 });

      const [, options] = getLastFetchCall();
      expect(options.next.revalidate).toBe(3600);
    });

    it("should disable revalidation when set to false", async () => {
      mockFetchSuccess({}, 200);

      await api.get("/users", { revalidateTime: false });

      const [, options] = getLastFetchCall();
      expect(options.next.revalidate).toBe(false);
    });

    it("should include tags in revalidation", async () => {
      mockFetchSuccess({}, 200);

      await api.get("/users", { tags: ["users", "list"] });

      const [, options] = getLastFetchCall();
      expect(options.next.tags).toEqual(["users", "list"]);
    });
  });

  describe("Response Parsing", () => {
    it("should parse JSON response correctly", async () => {
      const mockData = { email: "john@example.com", id: 1, name: "John" };
      mockFetchSuccess(mockData, 200);

      const result = await api.get("/users/1");

      expect(result.data).toEqual(mockData);
    });

    it("should handle empty response (200 OK with no content)", async () => {
      mockFetchSuccess(undefined, 200);

      const result = await api.get("/users");

      expect(result.status).toBe(200);
      expect(result.data).toBeUndefined();
    });

    it("should handle 204 No Content response", async () => {
      mockFetchSuccess(undefined, 204);

      const result = await api.get("/users/1");

      expect(result.status).toBe(204);
      expect(result.data).toBeUndefined();
    });

    it("should handle 205 Reset Content response", async () => {
      mockFetchSuccess(undefined, 205);

      const result = await api.get("/data");

      expect(result.status).toBe(205);
      expect(result.data).toBeUndefined();
    });

    it("should handle invalid JSON response", async () => {
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

      expect(result.status).toBe(200);
      expect(result.data).toBeUndefined();
    });
  });

  describe("Error Handling", () => {
    it("should handle 404 Not Found status", async () => {
      mockFetchErrorResponse(404, { message: "Not found" });

      const result = await api.get("/users/999");

      expect(result.status).toBe(404);
      expect(result.data).toEqual({ message: "Not found" });
    });

    it("should log error for 4xx status (not 404)", async () => {
      mockFetchErrorResponse(400, { message: "Bad request" });

      await api.get("/users");

      expect(getMockedConsoleError()).toHaveBeenCalled();
    });

    it("should log error for 5xx status", async () => {
      mockFetchErrorResponse(500, { message: "Server error" });

      await api.get("/users");

      const errorLog = getMockedConsoleError();
      expect(errorLog.mock.calls.length).toBeGreaterThan(0);
    });

    it("should return error status when request fails", async () => {
      mockFetchError(new Error("Network error"));

      const result = await api.get("/users");

      expect(result.status).toBe(500);
      expect(result.data).toBeInstanceOf(Error);
    });

    it("should handle fetch rejection with string message", async () => {
      mockFetchError("Connection timeout");

      const result = await api.get("/users");

      expect(result.status).toBe(500);
    });
  });

  describe("Generic Type Support", () => {
    it("should return typed data from response", async () => {
      interface User {
        email: string;
        id: number;
        name: string;
      }

      const mockUser: User = {
        email: "john@example.com",
        id: 1,
        name: "John Doe",
      };

      mockFetchSuccess(mockUser, 200);

      const result = await api.get<User>("/users/1");

      expect(result.data).toEqual(mockUser);
      expect(result.data?.id).toBe(1);
      expect(result.data?.email).toBe("john@example.com");
    });
  });

  describe("Auth Integration", () => {
    it("should call getAuth before making request", async () => {
      const getAuthSpy = vi.spyOn(api, "getAuth");
      mockFetchSuccess({}, 200);

      await api.get("/users");

      expect(getAuthSpy).toHaveBeenCalled();
    });
  });
});
