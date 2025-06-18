export type IPaginatedResponse<T extends Record<string, object[]>> = T & {
  total: number;
  page: number;
  limit: number;
};
