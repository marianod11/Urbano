import { SortBy, SortOrder } from 'src/enums/sort.enum';

export class UserQuery {
  firstName?: string;
  lastName?: string;
  username?: string;
  role?: string;

  sortBy?: SortBy;
  sortOrder?: SortOrder;

  page?: number;
  pageSize?: number;

}
