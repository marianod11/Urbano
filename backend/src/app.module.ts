import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { CourseModule } from './course/course.module';
import { StatsModule } from './stats/stats.module';
import { UserModule } from './user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    CourseModule,
    ContentModule,
    StatsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/course-contents'),
      serveRoot: '/course-contents',
      serveStaticOptions: {
        index: false,
        fallthrough: true,
      }
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
