/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Paginated result
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * API error response
 */
export interface ErrorResponse {
  error: string;
  details?: string[];
  status: number;
}

/**
 * API success response
 */
export interface SuccessResponse<T> {
  data: T;
  message?: string;
}
