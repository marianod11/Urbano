import { SortBy, SortOrder } from 'src/enums/sort.enum';


export class ContentQuery {
  name?: string;
  description?: string;
  dateCreated?: Date;

  sortBy?: SortBy;
  sortOrder?: SortOrder;

  page?: number;
  pageSize?: number;
}