import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';

import { CourseService } from '../course/course.service';
import { CreateContentDto, UpdateContentDto } from './content.dto';
import { Content } from './content.entity';
import { ContentQuery } from './content.query';
import * as fs from 'fs';
import * as path from 'path';
import { WhereConditions } from 'src/interfaces/interfaces';

@Injectable()
export class ContentService {
  constructor(private readonly courseService: CourseService) {}

  async save(
    courseId: string,
    createContentDto: CreateContentDto,
    path: string,
  ): Promise<Content> {
    const { name, description } = createContentDto;
    const course = await this.courseService.findById(courseId);
    return await Content.create({
      name,
      description,
      course,
      dateCreated: new Date(),
      path: path,
    }).save();
  }

  async findAll(contentQuery: ContentQuery): Promise<Content[]> {
    Object.keys(contentQuery).forEach((key) => {
      contentQuery[key] = ILike(`%${contentQuery[key]}%`);
    });

    return await Content.find({
      where: contentQuery,
      order: {
        name: 'ASC',
        description: 'ASC',
      },
    });
  }

  async findById(id: string): Promise<Content> {
    const content = await Content.findOne(id);

    if (!content) {
      throw new HttpException(
        `Could not find content with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return content;
  }

  async findByCourseIdAndId(courseId: string, id: string): Promise<Content> {
    const content = await Content.findOne({ where: { courseId, id } });
    if (!content) {
      throw new HttpException(
        `Could not find content with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return content;
  }

  async findAllByCourseId(
    courseId: string,
    contentQuery: ContentQuery
  ): Promise<{ content: Content[]; total: number }> {
    const {
      name,
      description,
      dateCreated,
      sortBy = 'name',
      sortOrder = 'ASC',
      page = 1,
      pageSize = 10
    } = contentQuery;

    const whereConditions: WhereConditions = { courseId }; 

    if (name) {
      whereConditions.name = ILike(`%${name}%`);
    }

    if (description) {
      whereConditions.description = ILike(`%${description}%`);
    }

    if (dateCreated) {
      whereConditions.dateCreated = dateCreated;
    }

    const order: any = {};
    order[sortBy] = sortOrder;

    const skip = (page - 1) * pageSize;

    const [content, total] = await Promise.all([
      Content.find({
        where: whereConditions,
        order,
        skip,
        take: pageSize,
      }),
      Content.count({ where: whereConditions }),
    ]);

    return { content, total };
  }

  async update(
    courseId: string,
    id: string,
    updateContentDto: UpdateContentDto,
  ): Promise<Content> {
    const content = await this.findByCourseIdAndId(courseId, id);
    if (updateContentDto.path && content.path && content.path !== updateContentDto.path) {
      this.deleteContentFile(content);
    }

    return await Content.create({ id: content.id, ...updateContentDto }).save();
  }

  async delete(courseId: string, id: string): Promise<string> {
    const content = await this.findByCourseIdAndId(courseId, id);

    this.deleteContentFile(content);

    await Content.delete(content);
    return id;
  }

  private deleteContentFile(content: Content): void {
    if (content.path) {
      const filename = path.basename(content.path);
      const filePath = path.join(__dirname, '..', '..', 'uploads', 'course-contents', filename);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${filePath}`, err.message);
        } else {
          console.log(`File deleted: ${filePath}`);
        }
      });
    }
  }

  async count(): Promise<number> {
    return await Content.count();
  }
}
