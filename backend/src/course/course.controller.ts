import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateContentDto, UpdateContentDto } from '../content/content.dto';
import { Content } from '../content/content.entity';
import { ContentQuery } from '../content/content.query';
import { ContentService } from '../content/content.service';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CourseQuery } from './course.query';
import { CourseService } from './course.service';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('courses')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@ApiTags('Courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly contentService: ContentService,
  ) {}

  @Post()
  @Roles(Role.Admin, Role.Editor)
  @UseInterceptors(FileInterceptor('file'))
  async save(
    @Body() body: CreateCourseDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Course> {
    const path = `http://localhost:5000/course-contents/${file.filename}`;
    return this.courseService.save(body, path);
  }

  @Get()
  async findAll(@Query() courseQuery: CourseQuery) {
    return await this.courseService.findAll(courseQuery);
  }
  
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<Course> {
    return await this.courseService.findById(id);
  }

  @Put('/:id')
  @Roles(Role.Admin, Role.Editor)
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Course> {
    if (file) {
      const path = `http://localhost:5000/course-contents/${file.filename}`;
      updateCourseDto.path = path;
    }
    return await this.courseService.update(id, updateCourseDto);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  async delete(@Param('id') id: string): Promise<string> {
    return await this.courseService.delete(id);
  }

  @Post('/:id/contents')
  @Roles(Role.Admin, Role.Editor)
  @UseInterceptors(FileInterceptor('file'))
  async saveContent(
    @Param('id') id: string,
    @Body() createContentDto: CreateContentDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Content> {
    const path = `http://localhost:5000/course-contents/${file.filename}`;
    return await this.contentService.save(id, createContentDto, path);
  }

  @Get('/:id/contents')
  async findAllContentsByCourseId(
    @Param('id') id: string,
    @Query() contentQuery: ContentQuery,
  ): Promise<{ content: Content[]; total: number }> {
    return await this.contentService.findAllByCourseId(id, contentQuery);
  }

  @Put('/:id/contents/:contentId')
  @Roles(Role.Admin, Role.Editor)
  @UseInterceptors(FileInterceptor('file'))
  async updateContent(
    @Param('id') id: string,
    @Param('contentId') contentId: string,
    @Body() updateContentDto: UpdateContentDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Content> {
    if (file) {
      const path = `http://localhost:5000/course-contents/${file.filename}`;
      updateContentDto.path = path; 
    }
    return await this.contentService.update(id, contentId, updateContentDto);
  }

  @Delete('/:id/contents/:contentId')
  @Roles(Role.Admin)
  async deleteContent(
    @Param('id') id: string,
    @Param('contentId') contentId: string,
  ): Promise<string> {
    return await this.contentService.delete(id, contentId);
  }


}
