import { beforeEach, describe, expect, it, vi } from "vitest";
import { BaseAPI } from "../../shared/apis/base.api";
import { IAPISettings } from "../../shared/types/api.type";
import {
  getLastFetchCall,
  getMockedConsoleError,
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

describe("BaseAPI - POST Method", () => {
  let api: TestAPI;

  beforeEach(() => {
    api = new TestAPI();
  });

  describe("Happy Path", () => {
    it("should POST data successfully", async () => {
      const mockData = { id: 1, name: "John" };
      mockFetchSuccess(mockData, 201);

      const result = await api.post("/users", { name: "John" });

      expect(result.status).toBe(201);
      expect(result.data).toEqual(mockData);
    });

    it("should construct full URL correctly", async () => {
      mockFetchSuccess({}, 201);

      await api.post("/users", { name: "John" });

      const [url] = getLastFetchCall();
      expect(url).toBe("https://api.example.com/users");
    });

    it("should set method to POST", async () => {
      mockFetchSuccess({}, 201);

      await api.post("/users", { name: "John" });

      const [, options] = getLastFetchCall();
      expect(options.method).toBe("POST");
    });

    it("should serialize body to JSON", async () => {
      mockFetchSuccess({}, 201);

      await api.post("/users", { age: 30, name: "John" });

      const [, options] = getLastFetchCall();
      expect(options.body).toBe(JSON.stringify({ age: 30, name: "John" }));
    });

    it("should set Content-Type header", async () => {
      mockFetchSuccess({}, 201);

      await api.post("/users", { name: "John" });

      const [, options] = getLastFetchCall();
      const headers = options.headers as Headers;
      expect(headers.get("Content-Type")).toBe("application/json");
    });

    it("should disable cache for POST", async () => {
      mockFetchSuccess({}, 201);

      await api.post("/users", { name: "John" });

      const [, options] = getLastFetchCall();
      expect(options.cache).toBe("no-store");
    });
  });

  describe("Payload Sanitization", () => {
    it("should sanitize payload by default", async () => {
      mockFetchSuccess({}, 201);

      const payload = {
        email: "john@example.com",
        name: 'John<script>alert("xss")</script>',
      };

      await api.post("/users", payload);

      const [, options] = getLastFetchCall();
      const sentPayload = JSON.parse(options.body as string);

      expect(sentPayload.name).toBe("John");
      expect(sentPayload.email).toBe("john@example.com");
    });

    it("should skip sanitization when enabled in settings", async () => {
      mockFetchSuccess({}, 201);

      const payload = {
        content: "<div>Safe HTML</div>",
        name: 'John<script>alert("xss")</script>',
      };

      await api.post("/users", payload, { skipSanitization: true });

      const [, options] = getLastFetchCall();
      const sentPayload = JSON.parse(options.body as string);

      expect(sentPayload.name).toBe(payload.name);
      expect(sentPayload.content).toBe(payload.content);
    });

    it("should sanitize nested objects", async () => {
      mockFetchSuccess({}, 201);

      const payload = {
        user: {
          name: "John<script>bad</script>",
          profile: {
            bio: "Dev<script>xss</script>",
          },
        },
      };

      await api.post("/users", payload);

      const [, options] = getLastFetchCall();
      const sentPayload = JSON.parse(options.body as string);

      expect(sentPayload.user.name).toBe("John");
      expect(sentPayload.user.profile.bio).toBe("Dev");
    });
  });

  describe("Request Options", () => {
    it("should include credentials when API_SETTINGS.includeCredentials is true", async () => {
      const apiWithCredentials = new TestAPI();
      apiWithCredentials.API_SETTINGS = { includeCredentials: true };

      mockFetchSuccess({}, 201);

      await apiWithCredentials.post("/users", { name: "John" });

      const [, options] = getLastFetchCall();
      expect(options.credentials).toBe("include");
    });

    it("should not include credentials by default", async () => {
      mockFetchSuccess({}, 201);

      await api.post("/users", { name: "John" });

      const [, options] = getLastFetchCall();
      expect(options.credentials).toBeUndefined();
    });
  });

  describe("Response Handling", () => {
    it("should parse JSON response", async () => {
      const mockData = { id: 1, name: "John" };
      mockFetchSuccess(mockData, 201);

      const result = await api.post("/users", { name: "John" });

      expect(result.data).toEqual(mockData);
    });

    it("should handle 204 No Content response", async () => {
      mockFetchSuccess(null, 204);

      const result = await api.post("/users", { name: "John" });

      expect(result.status).toBe(204);
      expect(result.data).toBeUndefined();
    });

    it("should handle empty response body", async () => {
      mockFetchSuccess(null, 200);

      const result = await api.post("/users", { name: "John" });

      expect(result.status).toBe(200);
    });
  });

  describe("Error Handling", () => {
    it("should handle 4xx error response", async () => {
      mockFetchErrorResponse(400, { message: "Bad request" });

      const result = await api.post("/users", { name: "John" });

      expect(result.status).toBe(400);
      expect(result.data).toEqual({ message: "Bad request" });
    });

    it("should handle 5xx error response", async () => {
      mockFetchErrorResponse(500, { message: "Server error" });

      await api.post("/users", { name: "John" });

      expect(getMockedConsoleError()).toHaveBeenCalled();
    });

    it("should handle network error", async () => {
      mockFetchError("Network timeout");

      const result = await api.post("/users", { name: "John" });

      expect(result.status).toBe(500);
    });

    it("should handle JSON parsing error in response", async () => {
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

      const result = await api.post("/users", { name: "John" });

      expect(result.status).toBe(200);
      expect(result.data).toBeUndefined();
    });
  });

  describe("Headers Merging", () => {
    it("should merge custom headers with default headers", async () => {
      mockFetchSuccess({}, 201);

      await api.post("/users", { name: "John" }, undefined);

      const [, options] = getLastFetchCall();
      const headers = options.headers as Headers;
      // Should have both X-Custom-Header and Content-Type
      expect(headers.get("X-Custom-Header")).toBe("test");
      expect(headers.get("Content-Type")).toBe("application/json");
    });
  });

  describe("Auth Integration", () => {
    it("should call getAuth before making request", async () => {
      const getAuthSpy = vi.spyOn(api, "getAuth");
      mockFetchSuccess({}, 201);

      await api.post("/users", { name: "John" });

      expect(getAuthSpy).toHaveBeenCalled();
    });
  });
});
