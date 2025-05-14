export class UserQuery {
  firstName?: string;
  lastName?: string;
  username?: string;
  role?: string;

  sortBy?: 'name' | 'description' | 'dateCreated';
  sortOrder?: 'ASC' | 'DESC';

  page?: number;
  pageSize?: number;

}
