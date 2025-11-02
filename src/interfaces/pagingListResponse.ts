export default interface PagingListResponse<T> {
  records: T[];
  totalPages: number;
}
