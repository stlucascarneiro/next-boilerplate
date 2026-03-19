/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BaseAPI } from "../../shared/apis/base.api";
import {
  getLastFetchCall,
  mockFetchError,
  mockFetchErrorResponse,
  mockFetchSuccess,
} from "../setup";

class TestAPI extends BaseAPI {
  BASE_URL = "https://api.example.com";
  HEADERS = { "X-Custom-Header": "test" };
  API_SETTINGS = undefined;

  async getAuth(): Promise<void> {
    // No-op
  }
}

describe("BaseAPI - DELETE Method", () => {
  let api: TestAPI;

  beforeEach(() => {
    api = new TestAPI();
  });

  describe("Happy Path", () => {
    it("should DELETE successfully with 200 status", async () => {
      mockFetchSuccess({}, 200);

      const result = await api.delete("/users/1");

      expect(result.status).toBe(200);
      expect(result.data).toBeUndefined();
    });

    it("should DELETE successfully with 204 No Content", async () => {
      mockFetchSuccess(null, 204);

      const result = await api.delete("/users/1");

      expect(result.status).toBe(204);
      expect(result.data).toBeUndefined();
    });

    it("should construct full URL correctly", async () => {
      mockFetchSuccess({}, 200);

      await api.delete("/users/1");

      const [url] = getLastFetchCall();
      expect(url).toBe("https://api.example.com/users/1");
    });

    it("should set method to DELETE", async () => {
      mockFetchSuccess({}, 200);

      await api.delete("/users/1");

      const [, options] = getLastFetchCall();
      expect(options.method).toBe("DELETE");
    });

    it("should disable cache for DELETE", async () => {
      mockFetchSuccess({}, 200);

      await api.delete("/users/1");

      const [, options] = getLastFetchCall();
      expect(options.cache).toBe("no-store");
    });

    it("should not include body in DELETE request", async () => {
      mockFetchSuccess({}, 200);

      await api.delete("/users/1");

      const [, options] = getLastFetchCall();
      expect(options.body).toBeUndefined();
    });
  });

  describe("Status Codes", () => {
    it("should handle 200 OK response", async () => {
      mockFetchSuccess({}, 200);

      const result = await api.delete("/users/1");

      expect(result.status).toBe(200);
    });

    it("should handle 204 No Content response", async () => {
      mockFetchSuccess(null, 204);

      const result = await api.delete("/users/1");

      expect(result.status).toBe(204);
      expect(result.data).toBeUndefined();
    });

    it("should handle 202 Accepted response", async () => {
      mockFetchSuccess({}, 202);

      const result = await api.delete("/users/1");

      expect(result.status).toBe(202);
    });

    it("should return success for all 2xx status codes", async () => {
      mockFetchSuccess({}, 201);

      const result = await api.delete("/users/1");

      expect(result.status).toBe(201);
      expect(result.data).toBeUndefined();
    });
  });

  describe("Error Handling", () => {
    it("should handle 404 Not Found", async () => {
      mockFetchErrorResponse(404, { message: "Not found" });

      const result = await api.delete("/users/999");

      expect(result.status).toBe(404);
      expect(result.data).toBeUndefined();
    });

    it("should handle 403 Forbidden", async () => {
      mockFetchErrorResponse(403, { message: "Forbidden" });

      const result = await api.delete("/users/1");

      expect(result.status).toBe(403);
    });

    it("should handle 5xx server error", async () => {
      mockFetchErrorResponse(500, { message: "Server error" });

      const result = await api.delete("/users/1");

      expect(result.status).toBe(500);
    });

    it("should handle network error", async () => {
      mockFetchError("Connection refused");

      const result = await api.delete("/users/1");

      expect(result.status).toBe(500);
    });

    it("should handle fetch rejection with Error object", async () => {
      mockFetchError(new Error("Network timeout"));

      const result = await api.delete("/users/1");

      expect(result.status).toBe(500);
    });
  });

  describe("Headers", () => {
    it("should include default headers in DELETE request", async () => {
      mockFetchSuccess({}, 200);

      await api.delete("/users/1");

      const [, options] = getLastFetchCall();
      const headers = options.headers;
      expect(headers.get("X-Custom-Header")).toBe("test");
    });
  });

  describe("Request Options", () => {
    it("should include credentials when API_SETTINGS.includeCredentials is true", async () => {
      const apiWithCredentials = new TestAPI();
      apiWithCredentials.API_SETTINGS = {
        includeCredentials: true,
      } as unknown as any;

      mockFetchSuccess({}, 200);

      await apiWithCredentials.delete("/users/1");

      const [, options] = getLastFetchCall();
      expect(options.credentials).toBe("include");
    });

    it("should not include credentials by default", async () => {
      mockFetchSuccess({}, 200);

      await api.delete("/users/1");

      const [, options] = getLastFetchCall();
      expect(options.credentials).toBeUndefined();
    });
  });

  describe("URL Handling", () => {
    it("should handle resource ID in URL", async () => {
      mockFetchSuccess({}, 204);

      await api.delete("/users/123");

      const [url] = getLastFetchCall();
      expect(url).toContain("/users/123");
    });

    it("should handle nested resource paths", async () => {
      mockFetchSuccess({}, 204);

      await api.delete("/users/1/posts/42");

      const [url] = getLastFetchCall();
      expect(url).toBe("https://api.example.com/users/1/posts/42");
    });
  });

  describe("Response Handling", () => {
    it("should always return undefined data", async () => {
      mockFetchSuccess({ message: "deleted" }, 200);

      const result = await api.delete("/users/1");

      expect(result.data).toBeUndefined();
    });

    it("should return success even if response has content", async () => {
      mockFetchSuccess({ deletedAt: "2026-03-18", id: 1 }, 200);

      const result = await api.delete("/users/1");

      expect(result.status).toBe(200);
      expect(result.data).toBeUndefined();
    });
  });

  describe("Auth Integration", () => {
    it("should call getAuth before making request", async () => {
      const getAuthSpy = vi.spyOn(api, "getAuth");
      mockFetchSuccess({}, 200);

      await api.delete("/users/1");

      expect(getAuthSpy).toHaveBeenCalled();
    });
  });
});
