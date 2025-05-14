export default interface ContentQuery {
  name?: string;
  description?: string;
  sortBy?: 'name' | 'description' | 'dateCreated';
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  pageSize?: number;
}
