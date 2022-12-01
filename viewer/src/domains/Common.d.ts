export type Pagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type Result<T> = {
  success: boolean;
  msgCode: string;
  msgInfo: string;
  status: number;
  errorList: string[];
  data: T;
  featureMap: Map;
  pagination: Pagination;
  total: number;
  pageSize: number;
}
