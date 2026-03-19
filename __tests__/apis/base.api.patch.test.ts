import { beforeEach, describe, expect, it, vi } from "vitest";
import { BaseAPI } from "../../shared/apis/base.api";
import { IAPISettings } from "../../shared/types/api.type";
import {
  getLastFetchCall,
  mockFetchError,
  mockFetchErrorResponse,
  mockFetchSuccess,
} from "../setup";

class TestAPI extends BaseAPI {
  BASE_URL = "https://api.example.com";
  HEADERS = { "X-Custom-Header": "test" };
  API_SETTINGS: IAPISettings | undefined = undefined;

  async getAuth(): Promise<void> {
    // No-op
  }
}

describe("BaseAPI - PATCH Method", () => {
  let api: TestAPI;

  beforeEach(() => {
    api = new TestAPI();
  });

  describe("Happy Path", () => {
    it("should PATCH data successfully", async () => {
      const mockData = { id: 1, name: "Jane" };
      mockFetchSuccess(mockData, 200);

      const result = await api.patch("/users/1", { name: "Jane" });

      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockData);
    });

    it("should construct full URL correctly", async () => {
      mockFetchSuccess({}, 200);

      await api.patch("/users/1", { name: "Jane" });

      const [url] = getLastFetchCall();
      expect(url).toBe("https://api.example.com/users/1");
    });

    it("should set method to PATCH", async () => {
      mockFetchSuccess({}, 200);

      await api.patch("/users/1", { name: "Jane" });

      const [, options] = getLastFetchCall();
      expect(options.method).toBe("PATCH");
    });

    it("should serialize body to JSON", async () => {
      mockFetchSuccess({}, 200);

      await api.patch("/users/1", { age: 28, name: "Jane" });

      const [, options] = getLastFetchCall();
      expect(options.body).toBe(JSON.stringify({ age: 28, name: "Jane" }));
    });

    it("should set Content-Type header", async () => {
      mockFetchSuccess({}, 200);

      await api.patch("/users/1", { name: "Jane" });

      const [, options] = getLastFetchCall();
      const headers = options.headers as Headers;
      expect(headers.get("Content-Type")).toBe("application/json");
    });

    it("should disable cache for PATCH", async () => {
      mockFetchSuccess({}, 200);

      await api.patch("/users/1", { name: "Jane" });

      const [, options] = getLastFetchCall();
      expect(options.cache).toBe("no-store");
    });
  });

  describe("Body Handling", () => {
    it("should handle undefined body", async () => {
      mockFetchSuccess({}, 200);

      const result = await api.patch("/users/1");

      expect(result.status).toBe(200);

      const [, options] = getLastFetchCall();
      expect(options.body).toBe(JSON.stringify({}));
    });

    it("should handle undefined body with settings", async () => {
      mockFetchSuccess({}, 200);

      await api.patch("/users/1", undefined, { skipSanitization: true });

      const [, options] = getLastFetchCall();
      expect(options.body).toBe(JSON.stringify({}));
    });

    it("should handle empty object body", async () => {
      mockFetchSuccess({}, 200);

      await api.patch("/users/1", {});

      const [, options] = getLastFetchCall();
      expect(options.body).toBe(JSON.stringify({}));
    });

    it("should handle partial update payload", async () => {
      mockFetchSuccess({}, 200);

      await api.patch("/users/1", { name: "Jane" });

      const [, options] = getLastFetchCall();
      const body = JSON.parse(options.body as string);

      expect(body).toEqual({ name: "Jane" });
      expect(body).not.toHaveProperty("email");
    });
  });

  describe("Payload Sanitization", () => {
    it("should sanitize payload by default", async () => {
      mockFetchSuccess({}, 200);

      const payload = {
        name: 'Jane<script>alert("xss")</script>',
      };

      await api.patch("/users/1", payload);

      const [, options] = getLastFetchCall();
      const sentPayload = JSON.parse(options.body as string);

      expect(sentPayload.name).toBe("Jane");
    });

    it("should skip sanitization when enabled", async () => {
      mockFetchSuccess({}, 200);

      const payload = {
        bio: '<div onclick="alert()">Content</div>',
      };

      await api.patch("/users/1", payload, { skipSanitization: true });

      const [, options] = getLastFetchCall();
      const sentPayload = JSON.parse(options.body as string);

      expect(sentPayload.bio).toBe(payload.bio);
    });

    it("should sanitize nested objects in PATCH", async () => {
      mockFetchSuccess({}, 200);

      const payload = {
        profile: {
          bio: "Developer<script>bad</script>",
        },
      };

      await api.patch("/users/1", payload);

      const [, options] = getLastFetchCall();
      const sentPayload = JSON.parse(options.body as string);

      expect(sentPayload.profile.bio).toBe("Developer");
    });
  });

  describe("Response Handling", () => {
    it("should parse JSON response", async () => {
      const mockData = { id: 1, name: "Jane" };
      mockFetchSuccess(mockData, 200);

      const result = await api.patch("/users/1", { name: "Jane" });

      expect(result.data).toEqual(mockData);
    });

    it("should handle 204 No Content response", async () => {
      mockFetchSuccess(null, 204);

      const result = await api.patch("/users/1", { name: "Jane" });

      expect(result.status).toBe(204);
      expect(result.data).toBeUndefined();
    });

    it("should handle empty response body", async () => {
      mockFetchSuccess(null, 200);

      const result = await api.patch("/users/1", { name: "Jane" });

      expect(result.status).toBe(200);
    });
  });

  describe("Error Handling", () => {
    it("should handle 4xx error response", async () => {
      mockFetchErrorResponse(400, { message: "Bad request" });

      const result = await api.patch("/users/1", { name: "Jane" });

      expect(result.status).toBe(400);
      expect(result.data).toEqual({ message: "Bad request" });
    });

    it("should handle 5xx error response", async () => {
      mockFetchErrorResponse(500, { message: "Server error" });

      const result = await api.patch("/users/1", { name: "Jane" });

      expect(result.status).toBe(500);
    });

    it("should handle network error", async () => {
      mockFetchError("Network timeout");

      const result = await api.patch("/users/1", { name: "Jane" });

      expect(result.status).toBe(500);
    });

    it("should handle JSON parsing error", async () => {
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

      const result = await api.patch("/users/1", { name: "Jane" });

      expect(result.status).toBe(200);
      expect(result.data).toBeUndefined();
    });
  });

  describe("Request Options", () => {
    it("should include credentials when API_SETTINGS.includeCredentials is true", async () => {
      const apiWithCredentials = new TestAPI();
      apiWithCredentials.API_SETTINGS = { includeCredentials: true };

      mockFetchSuccess({}, 200);

      await apiWithCredentials.patch("/users/1", { name: "Jane" });

      const [, options] = getLastFetchCall();
      expect(options.credentials).toBe("include");
    });

    it("should not include credentials by default", async () => {
      mockFetchSuccess({}, 200);

      await api.patch("/users/1", { name: "Jane" });

      const [, options] = getLastFetchCall();
      expect(options.credentials).toBeUndefined();
    });
  });

  describe("Auth Integration", () => {
    it("should call getAuth before making request", async () => {
      const getAuthSpy = vi.spyOn(api, "getAuth");
      mockFetchSuccess({}, 200);

      await api.patch("/users/1", { name: "Jane" });

      expect(getAuthSpy).toHaveBeenCalled();
    });
  });
});
