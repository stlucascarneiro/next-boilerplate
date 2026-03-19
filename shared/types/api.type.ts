export const AUTH_METHODS = ["none", "basic", "bearer", "api-key"] as const;

export interface IAPISettings {
  authMethod?: (typeof AUTH_METHODS)[number];
  includeCredentials?: boolean;
}

export interface IRequestSettings {
  revalidateTime?: false | number;
  skipSanitization?: boolean;
  tags?: string[];
}

export interface IApiDefaultResponse<T = unknown> {
  data: T;
  status: number;
}

export interface IActionResponse {
  redirect?: string;
  reload?: boolean;
  showToastOnSuccess?: boolean;
  statusCode: number;
}

export interface IApiCreateResponse extends IApiDefaultResponse {
  data: {
    created: boolean;
    id: string;
  };
}

export interface IApiUpdateResponse extends IApiDefaultResponse {
  data: {
    id: string;
    updated: boolean;
  };
}

export interface IPagination {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number;
  page: number;
  pageSize: number;
  previousPage: number;
  records: number;
  recordsOnPage: number;
  recordsRange: string;
  totalPages: number;
}
