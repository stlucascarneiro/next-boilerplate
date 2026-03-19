import { STATUS_CODES } from "../constants/http.data";
import { Logger } from "../services/logger";
import { removeScriptsFromObject } from "../services/sanitize";
import { parseObjectToQueryParams } from "../services/utils";
import {
  IApiDefaultResponse,
  IAPISettings,
  IRequestSettings,
} from "../types/api.type";

export abstract class BaseAPI {
  abstract BASE_URL: string;
  abstract HEADERS: Record<string, string>;
  abstract API_SETTINGS?: IAPISettings;
  abstract getAuth(): Promise<void>;

  private isErrorStatus(status: number): boolean {
    return status >= 400 && status !== STATUS_CODES.CLIENT_ERROR.NOT_FOUND;
  }

  private isEmptyContentStatus(status: number): boolean {
    return (
      status === STATUS_CODES.SUCCESS.NO_CONTENT ||
      status === STATUS_CODES.SUCCESS.RESET_CONTENT
    );
  }

  private buildHeaders(headers?: HeadersInit): Headers {
    const requestHeaders = new Headers(this.HEADERS);

    if (!headers) {
      return requestHeaders;
    }

    new Headers(headers).forEach((value, key) => {
      requestHeaders.set(key, value);
    });

    return requestHeaders;
  }

  private buildPathWithParams(
    path: string,
    params?: Record<string, boolean | number | string | undefined>,
  ): string {
    if (!params) {
      return path;
    }

    const queryParams = parseObjectToQueryParams(params);

    if (!queryParams) {
      return path;
    }

    const separator = path.includes("?") ? "&" : "?";

    return `${path}${separator}${queryParams}`;
  }

  private sanitizeHeadersForLog(headers: Headers): Record<string, string> {
    const sanitizedHeaders: Record<string, string> = {};

    headers.forEach((value, key) => {
      if (key.toLowerCase() === "authorization") {
        return;
      }

      sanitizedHeaders[key] = value;
    });

    return sanitizedHeaders;
  }

  private async parseResponseData<T>(
    response: Response,
  ): Promise<T | undefined> {
    if (this.isEmptyContentStatus(response.status)) {
      return undefined;
    }

    try {
      return (await response.json()) as T;
    } catch {
      return undefined;
    }
  }

  private async readResponseBody(response: Response): Promise<unknown> {
    try {
      return await response.clone().json();
    } catch {
      try {
        return await response.clone().text();
      } catch {
        return "[Unable to read response body]";
      }
    }
  }

  private buildErrorResponse(error: unknown): IApiDefaultResponse<unknown> {
    return { data: error, status: 500 };
  }

  private async request(
    requestInfo: RequestInfo,
    options: RequestInit,
  ): Promise<Response> {
    await this.getAuth();
    const requestHeaders = this.buildHeaders(options.headers);
    options.headers = requestHeaders;

    if (this.API_SETTINGS?.includeCredentials) {
      options.credentials = "include";
    }

    const requestLogDetails = {
      headers: this.sanitizeHeadersForLog(requestHeaders),
      method: options?.method || "GET",
      url: typeof requestInfo === "string" ? requestInfo : requestInfo.url,
    };

    try {
      const response = await fetch(requestInfo, options);

      if (this.isErrorStatus(response.status)) {
        const responseBody = await this.readResponseBody(response);

        Logger.error({
          label: this.constructor.name,
          message: "Request error",
          object: {
            ...requestLogDetails,
            response: responseBody,
            status: response.status,
          },
        });
      }

      return response;
    } catch (error) {
      Logger.error({
        label: this.constructor.name,
        message: "Request error",
        object: {
          ...requestLogDetails,
          error: error instanceof Error ? error.message : String(error),
        },
      });
      throw error;
    }
  }

  async get<T>(
    path: string,
    settings?: IRequestSettings,
    params?: Record<string, boolean | number | string | undefined>,
  ): Promise<IApiDefaultResponse<T>> {
    const options: RequestInit = {
      method: "GET",
      next: {
        revalidate: settings?.revalidateTime ?? 600,
        tags: settings?.tags,
      },
    };

    path = this.buildPathWithParams(path, params);

    try {
      const response = await this.request(`${this.BASE_URL}${path}`, options);
      const data = await this.parseResponseData<T>(response);

      return {
        data: data as T,
        status: response.status,
      };
    } catch (error: unknown) {
      return this.buildErrorResponse(error) as IApiDefaultResponse<T>;
    }
  }

  async post(
    path: string,
    body: Record<string, unknown>,
    settings?: IRequestSettings,
  ): Promise<IApiDefaultResponse> {
    const payload = settings?.skipSanitization
      ? body
      : removeScriptsFromObject(body);

    const options: RequestInit = {
      body: JSON.stringify(payload),
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    };

    try {
      const response = await this.request(`${this.BASE_URL}${path}`, options);
      const data = await this.parseResponseData(response);

      return {
        data,
        status: response.status,
      };
    } catch (error: unknown) {
      return this.buildErrorResponse(error);
    }
  }

  async patch(
    path: string,
    body?: Record<string, unknown>,
    settings?: IRequestSettings,
  ): Promise<IApiDefaultResponse> {
    const payload = settings?.skipSanitization
      ? (body ?? {})
      : removeScriptsFromObject(body ?? {});

    const options: RequestInit = {
      body: JSON.stringify(payload),
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
    };

    try {
      const response = await this.request(`${this.BASE_URL}${path}`, options);
      const data = await this.parseResponseData(response);

      return {
        data,
        status: response.status,
      };
    } catch (error: unknown) {
      return this.buildErrorResponse(error);
    }
  }

  async delete(path: string): Promise<IApiDefaultResponse> {
    const options: RequestInit = {
      cache: "no-store",
      method: "DELETE",
    };

    try {
      const response = await this.request(`${this.BASE_URL}${path}`, options);

      return {
        data: undefined,
        status: response.status,
      };
    } catch (error: unknown) {
      return this.buildErrorResponse(error);
    }
  }

  async sendFormData(
    path: string,
    formData: FormData,
  ): Promise<IApiDefaultResponse> {
    const options: RequestInit = {
      body: formData,
      cache: "no-store",
      method: "POST",
    };

    try {
      const response = await this.request(`${this.BASE_URL}${path}`, options);
      const data = await this.parseResponseData(response);

      return {
        data,
        status: response.status,
      };
    } catch (error: unknown) {
      return this.buildErrorResponse(error);
    }
  }
}
