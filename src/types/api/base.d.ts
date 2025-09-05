export interface PageQueryParam {
  page ?: number;
  size ?: number;
}

export interface PageResult<T> {
  list: T;
  total: number;
}

export interface RepData<T> {
  code: number;
  data: T;
  message : string
}
