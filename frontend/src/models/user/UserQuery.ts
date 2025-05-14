export default interface UserQuery {
  firstName?: string;
  lastName?: string;
  username?: string;
  role?: string;
  sortBy?: 'name' | 'description' | 'dateCreated';
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  pageSize?: number;
  hasFavorite?: boolean;
  hasInscription?: boolean;
  courseId?: string;
}
