import { SortBy, SortOrder } from 'src/interfaces/interfaces';


export class ContentQuery {
  name?: string;
  description?: string;
  dateCreated?: Date;

  sortBy?: SortBy;
  sortOrder?: SortOrder;

  page?: number;
  pageSize?: number;
}