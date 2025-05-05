import { PaginationParams, PaginatedResult } from '../types/common.types';

/**
 * Default pagination values
 */
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

/**
 * Parse pagination parameters from query parameters
 * @param query Query parameters
 * @returns Pagination parameters
 */
export const parsePaginationParams = (query: any): PaginationParams => {
  const page = Math.max(parseInt(query.page as string, 10) || DEFAULT_PAGE, 1);
  const limit = Math.min(
    Math.max(parseInt(query.limit as string, 10) || DEFAULT_LIMIT, 1),
    MAX_LIMIT
  );

  return { page, limit };
};

/**
 * Calculate pagination values
 * @param page Current page
 * @param limit Items per page
 * @param total Total number of items
 * @returns Pagination values
 */
export const calculatePagination = (
  page: number,
  limit: number,
  total: number
): { offset: number; totalPages: number } => {
  const offset = (page - 1) * limit;
  const totalPages = Math.ceil(total / limit);

  return { offset, totalPages };
};

/**
 * Create a paginated result
 * @param data Data items
 * @param total Total number of items
 * @param page Current page
 * @param limit Items per page
 * @returns Paginated result
 */
export const createPaginatedResult = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<T> => {
  const { totalPages } = calculatePagination(page, limit, total);

  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
};
