import { SortBy, SortOrder } from 'src/enums/sort.enum';

export class CourseQuery {
  name?: string;
  description?: string;
  dateCreated?: Date;

  sortBy?: SortBy;
  sortOrder?: SortOrder;

  page?: number;
  pageSize?: number;

  userId?: string;
  favorite?: boolean;
  inscribed?: boolean;
}