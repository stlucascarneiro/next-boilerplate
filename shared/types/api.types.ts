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
