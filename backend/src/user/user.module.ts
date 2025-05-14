import { Module, forwardRef } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [forwardRef(() => CourseModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
