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

describe("BaseAPI - FormData Method", () => {
  let api: TestAPI;

  beforeEach(() => {
    api = new TestAPI();
  });

  describe("Happy Path", () => {
    it("should send FormData successfully", async () => {
      const mockData = { fileId: "123", success: true };
      mockFetchSuccess(mockData, 200);

      const formData = new FormData();
      formData.append("file", new Blob(["content"], { type: "text/plain" }));
      formData.append("name", "test.txt");

      const result = await api.sendFormData("/upload", formData);

      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockData);
    });

    it("should construct full URL correctly", async () => {
      mockFetchSuccess({}, 200);

      const formData = new FormData();
      await api.sendFormData("/upload", formData);

      const [url] = getLastFetchCall();
      expect(url).toBe("https://api.example.com/upload");
    });

    it("should set method to POST for FormData", async () => {
      mockFetchSuccess({}, 200);

      const formData = new FormData();
      await api.sendFormData("/files", formData);

      const [, options] = getLastFetchCall();
      expect(options.method).toBe("POST");
    });

    it("should send FormData as body (not serialize)", async () => {
      mockFetchSuccess({}, 200);

      const formData = new FormData();
      formData.append("field1", "value1");

      await api.sendFormData("/upload", formData);

      const [, options] = getLastFetchCall();
      expect(options.body).toEqual(formData);
    });

    it("should NOT set Content-Type header (let browser set it)", async () => {
      mockFetchSuccess({}, 200);

      const formData = new FormData();
      await api.sendFormData("/upload", formData);

      const [, options] = getLastFetchCall();
      // Content-Type should not be explicitly set for FormData
      // (browser automatically sets "multipart/form-data; boundary=...")
      const headers = options.headers as Headers;
      expect(headers.get("Content-Type")).toBeNull();
    });

    it("should disable cache for FormData upload", async () => {
      mockFetchSuccess({}, 200);

      const formData = new FormData();
      await api.sendFormData("/upload", formData);

      const [, options] = getLastFetchCall();
      expect(options.cache).toBe("no-store");
    });
  });

  describe("FormData with Multiple Fields", () => {
    it("should handle FormData with multiple files", async () => {
      mockFetchSuccess({}, 200);

      const formData = new FormData();
      formData.append("files", new Blob(["file1"], { type: "text/plain" }));
      formData.append("files", new Blob(["file2"], { type: "text/plain" }));
      formData.append("description", "Multiple files");

      const result = await api.sendFormData("/upload-multiple", formData);

      expect(result.status).toBe(200);

      const [, options] = getLastFetchCall();
      expect(options.body).toEqual(formData);
    });

    it("should handle FormData with mixed content", async () => {
      mockFetchSuccess({}, 200);

      const formData = new FormData();
      formData.append("file", new Blob(["content"]), "document.pdf");
      formData.append("userId", "123");
      formData.append("metadata", '{"title":"Document"}');

      await api.sendFormData("/documents", formData);

      const [, options] = getLastFetchCall();
      expect(options.body).toEqual(formData);
    });
  });

  describe("Response Parsing", () => {
    it("should parse JSON response", async () => {
      const mockData = { id: "file123", uploadedAt: "2026-03-18" };
      mockFetchSuccess(mockData, 200);

      const formData = new FormData();
      const result = await api.sendFormData("/upload", formData);

      expect(result.data).toEqual(mockData);
    });

    it("should handle 201 Created response", async () => {
      const mockData = { id: "file123" };
      mockFetchSuccess(mockData, 201);

      const formData = new FormData();
      const result = await api.sendFormData("/upload", formData);

      expect(result.status).toBe(201);
      expect(result.data).toEqual(mockData);
    });

    it("should handle 204 No Content response", async () => {
      mockFetchSuccess(null, 204);

      const formData = new FormData();
      const result = await api.sendFormData("/upload", formData);

      expect(result.status).toBe(204);
      expect(result.data).toBeUndefined();
    });

    it("should handle text response", async () => {
      const json = vi.fn().mockRejectedValueOnce(new Error("Not JSON"));
      const text = vi.fn().mockResolvedValueOnce("File uploaded successfully");
      const mockResponse = {
        clone: vi.fn(() => {
          return {
            json,
            text,
          };
        }),
        headers: new Headers({ "content-type": "text/plain" }),
        json,
        status: 200,
        text,
      };
      vi.mocked(global.fetch).mockResolvedValueOnce(
        mockResponse as unknown as Response,
      );

      const formData = new FormData();
      const result = await api.sendFormData("/upload", formData);

      expect(result.status).toBe(200);
      // Should handle parse error gracefully
      expect(result.data).toBeUndefined();
    });
  });

  describe("Error Handling", () => {
    it("should handle 400 Bad Request", async () => {
      mockFetchErrorResponse(400, { error: "Invalid file" });

      const formData = new FormData();
      const result = await api.sendFormData("/upload", formData);

      expect(result.status).toBe(400);
      expect(result.data).toEqual({ error: "Invalid file" });
    });

    it("should handle 413 Payload Too Large", async () => {
      mockFetchErrorResponse(413, { error: "File too large" });

      const formData = new FormData();
      const result = await api.sendFormData("/upload", formData);

      expect(result.status).toBe(413);
    });

    it("should handle 500 Server Error", async () => {
      mockFetchErrorResponse(500, { error: "Server error" });

      const formData = new FormData();
      const result = await api.sendFormData("/upload", formData);

      expect(result.status).toBe(500);
    });

    it("should handle network error", async () => {
      mockFetchError("Connection timeout");

      const formData = new FormData();
      const result = await api.sendFormData("/upload", formData);

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
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse as Response);

      const formData = new FormData();
      const result = await api.sendFormData("/upload", formData);

      expect(result.status).toBe(200);
      expect(result.data).toBeUndefined();
    });
  });

  describe("Headers", () => {
    it("should include custom headers (except Content-Type)", async () => {
      mockFetchSuccess({}, 200);

      const formData = new FormData();
      await api.sendFormData("/upload", formData);

      const [, options] = getLastFetchCall();
      const headers = options.headers;
      expect(headers.get("X-Custom-Header")).toBe("test");
    });
  });

  describe("Request Options", () => {
    it("should include credentials when API_SETTINGS.includeCredentials is true", async () => {
      const apiWithCredentials = new TestAPI();
      apiWithCredentials.API_SETTINGS = { includeCredentials: true };

      mockFetchSuccess({}, 200);

      const formData = new FormData();
      await apiWithCredentials.sendFormData("/upload", formData);

      const [, options] = getLastFetchCall();
      expect(options.credentials).toBe("include");
    });

    it("should not include credentials by default", async () => {
      mockFetchSuccess({}, 200);

      const formData = new FormData();
      await api.sendFormData("/upload", formData);

      const [, options] = getLastFetchCall();
      expect(options.credentials).toBeUndefined();
    });
  });

  describe("Auth Integration", () => {
    it("should call getAuth before making request", async () => {
      const getAuthSpy = vi.spyOn(api, "getAuth");
      mockFetchSuccess({}, 200);

      const formData = new FormData();
      await api.sendFormData("/upload", formData);

      expect(getAuthSpy).toHaveBeenCalled();
    });
  });

  describe("Empty FormData", () => {
    it("should handle empty FormData", async () => {
      mockFetchSuccess({ message: "ok" }, 200);

      const emptyFormData = new FormData();
      const result = await api.sendFormData("/upload", emptyFormData);

      expect(result.status).toBe(200);
    });
  });
});
