export default interface CourseQuery {
  name?: string;
  description?: string;
  sortBy?: 'name' | 'description' | 'dateCreated';
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  pageSize?: number;

  userId?: string;
  favorite?: boolean;
  inscribed?: boolean;
}
