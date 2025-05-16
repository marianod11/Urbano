import { FindOperator } from 'typeorm';

export interface WhereConditions {
  name?: FindOperator<string>;
  description?: FindOperator<string>;
  dateCreated?: Date;
  firstName?: FindOperator<string>;
  lastName?: FindOperator<string>;
  username?: FindOperator<string>;
  role?: string;
  courseId?: string;
}