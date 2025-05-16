
import { HttpException, HttpStatus, Injectable, forwardRef, Inject } from '@nestjs/common';
import {  ILike } from 'typeorm';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CourseQuery } from './course.query';
import * as fs from 'fs';
import * as path from 'path';
import { UserService } from '../user/user.service';
import { WhereConditions } from '../interfaces/interfaces';
import { SortBy, SortOrder } from 'src/enums/sort.enum';



type Order = Partial<Record<SortBy, SortOrder>>;
@Injectable()
export class CourseService {
  constructor(@Inject(forwardRef(() => UserService)) private readonly userService: UserService,) {}


  async save(createCourseDto: CreateCourseDto, path: string ): Promise<Course> {
    return await Course.create({
      ...createCourseDto,
      dateCreated: new Date(),
      path:path,
    }).save();
  }

  async findAll(courseQuery: CourseQuery): Promise<{ courses: Course[], total: number }> {
    const {
      name,
      description,
      dateCreated,
      sortBy = SortBy.name,
      sortOrder = SortOrder.ASC,
      page = 1,
      pageSize = 10,
      userId,
      favorite = false,
      inscribed = false
    } = courseQuery;

    const whereConditions: WhereConditions = {};

    if (name) {
      whereConditions.name = ILike(`%${name}%`);
    }

    if (description) {
      whereConditions.description = ILike(`%${description}%`);
    }

    if (dateCreated) {
      whereConditions.dateCreated = dateCreated;
    }

    const order: Order = {};
    order[sortBy] = sortOrder;

    const skip = (page - 1) * pageSize;

    let favoriteCourses = [];
    let inscribedCourses = [];

    if (userId) {
      if (favorite) {
        favoriteCourses = await this.userService.findFavoriteCourses(userId);
      }

      if (inscribed) {
        inscribedCourses = await this.userService.findInscriptionCourses(userId);
      }
    }

    const [allCourses, total] = await Promise.all([
      Course.find({
        where: whereConditions,
        order,
        skip,
        take: pageSize,
      }),
      Course.count({ where: whereConditions }),
    ]);

    if (!userId || (!favorite && !inscribed)) {
      return { courses: allCourses, total };
    }

    const favoriteIds = favoriteCourses.map(course => course.id);
    const inscribedIds = inscribedCourses.map(course => course.id);

    let filteredCourses = [...allCourses];

    if (favorite) {
      filteredCourses = filteredCourses.filter(course => favoriteIds.includes(course.id));
    }

    if (inscribed) {
      filteredCourses = filteredCourses.filter(course => inscribedIds.includes(course.id));
    }

    return {
      courses: filteredCourses,
      total: filteredCourses.length
    };
  }

  async findById(id: string): Promise<Course> {
    const course = await Course.findOne(id);
    if (!course) {
      throw new HttpException(
        `Could not find course with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findById(id);
    if (updateCourseDto.path && course.path && course.path !== updateCourseDto.path) {
      this.deleteCourseImage(course);
    }

    return await Course.create({ id: course.id, ...updateCourseDto }).save();
  }

  async delete(id: string): Promise<string> {
    const course = await this.findById(id);
    this.deleteCourseImage(course);

    await Course.delete(course);
    return id;
  }

  private deleteCourseImage(course: Course): void {
    if (course.path) {
      const filename = path.basename(course.path);
      const filePath = path.join(__dirname, '..', '..', 'uploads', 'course-contents', filename);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting image: ${filePath}`, err.message);
        } else {
          console.log(`Image deleted: ${filePath}`);
        }
      });
    }
  }

  async count(): Promise<number> {
    return await Course.count();
  }

    
}
