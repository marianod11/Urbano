import { forwardRef, Module } from '@nestjs/common';

import { ContentModule } from '../content/content.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { UserModule } from '../user/user.module';

@Module({
  imports: [forwardRef(() => ContentModule),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/course-contents',
        filename: (req, file, callback) => {
          const ext = path.extname(file.originalname);
          const filename = `${uuidv4()}${ext}`;
          callback(null, filename);
        },
      }),
    }),
    forwardRef(() => UserModule)
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
