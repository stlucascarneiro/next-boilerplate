import { afterAll, beforeEach, vi } from "vitest";

/**
 * Global test setup for unit tests
 * Mocks external dependencies: fetch, console, global objects
 */

// Mock fetch globally
global.fetch = vi.fn();

// Mock console
const originalError = console.error;
console.error = vi.fn();

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

/**
 * Helper: Create a mock Response object
 * @param data - Response body as object or string
 * @param status - HTTP status code
 * @param contentType - Content-Type header
 */
export function createMockResponse<T = unknown>(
  data?: null | T,
  status = 200,
  contentType = "application/json",
) {
  const body = data ? JSON.stringify(data) : "";

  return {
    clone: vi.fn(function () {
      return {
        json: vi.fn(async () => {
          if (!body) throw new Error("No content to parse");
          return JSON.parse(body);
        }),
        text: vi.fn(async () => body),
      };
    }),
    headers: new Headers({ "content-type": contentType }),
    json: vi.fn(async () => {
      if (!body) throw new Error("No content to parse");
      return JSON.parse(body);
    }),
    ok: status >= 200 && status < 300,
    status,
    text: vi.fn(async () => body),
  } as unknown as Response;
}

/**
 * Helper: Create a mock error Response
 * @param status - HTTP status code (4xx or 5xx)
 * @param errorData - Error response body
 */
export function createErrorResponse<T = unknown>(
  status: number,
  errorData?: T,
) {
  return createMockResponse(errorData, status);
}

/**
 * Helper: Setup successful fetch mock
 * @param data - Response data
 * @param status - HTTP status code
 */
export function mockFetchSuccess<T = unknown>(data?: T, status = 200) {
  (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
    createMockResponse(data, status),
  );
}

/**
 * Helper: Setup failed fetch mock (network error)
 * @param error - Error message or Error object
 */
export function mockFetchError(error: Error | string) {
  const errorObj = typeof error === "string" ? new Error(error) : error;
  (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(errorObj);
}

/**
 * Helper: Setup error response mock (HTTP error)
 * @param status - HTTP status code
 * @param errorData - Error response body
 */
export function mockFetchErrorResponse<T = unknown>(
  status: number,
  errorData?: T,
) {
  (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
    createErrorResponse(status, errorData),
  );
}

/**
 * Get the last fetch call arguments
 */
export function getLastFetchCall() {
  const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
  return calls[calls.length - 1];
}

/**
 * Get all fetch calls
 */
export function getAllFetchCalls() {
  return (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
}

/**
 * Get mocked fetch as typed function (for assertions)
 */
export function getMockedFetch() {
  return global.fetch as ReturnType<typeof vi.fn>;
}

/**
 * Get mocked console.error
 */
export function getMockedConsoleError() {
  return console.error as ReturnType<typeof vi.fn>;
}

// Cleanup: Restore console.error after tests
afterAll(() => {
  console.error = originalError;
});
