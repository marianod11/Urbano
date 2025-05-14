export class ContentQuery {
  name?: string;
  description?: string;
  dateCreated?: Date;

  sortBy?: 'name' | 'description' | 'dateCreated';
  sortOrder?: 'ASC' | 'DESC';

  page?: number;
  pageSize?: number;
}