import { HttpException, HttpStatus, Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ILike } from 'typeorm';

import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.entity';
import { UserQuery } from './user.query';
import { CourseService } from '../course/course.service';
import { Course } from '../course/course.entity';

@Injectable()
export class UserService {

  constructor(@Inject(forwardRef(() => CourseService)) private readonly courseService: CourseService,) {}

  async save(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findByUsername(createUserDto.username);

    if (user) {
      throw new HttpException(
        `User with username ${createUserDto.username} is already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const { password } = createUserDto;
    createUserDto.password = await bcrypt.hash(password, 10);
    return User.create(createUserDto).save();
  }

  async findAll(userQuery: UserQuery): Promise<{ users: User[]; total: number }> {
    const {
      firstName,
      lastName,
      username,
      role,
      sortBy = 'firstName', 
      sortOrder = 'ASC',      
      page = 1,             
      pageSize = 10      
   
    } = userQuery;

    const whereConditions: any = {};

    if (firstName) {
      whereConditions.firstName = ILike(`%${firstName}%`);
    }

    if (lastName) {
      whereConditions.lastName = ILike(`%${lastName}%`);
    }

    if (username) {
      whereConditions.username = ILike(`%${username}%`);
    }

    if (role) {
      whereConditions.role = role; 
    }

    const order: any = {};

    const sortFieldMap = {
      name: 'firstName',          
      description: 'lastName',    
      dateCreated: 'createdAt'    
    };

    const actualSortField = sortFieldMap[sortBy] || sortBy;
    order[actualSortField] = sortOrder;

    const skip = (page - 1) * pageSize;

    const [users, total] = await Promise.all([
      User.find({
        where: whereConditions,
        order,
        skip,
        take: pageSize,
      }),
      User.count({ where: whereConditions }),
    ]);

    return { users, total };
  }

  async findById(id: string): Promise<User> {
    const user = await User.findOne(id);

    if (!user) {
      throw new HttpException(
        `Could not find user with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    return User.findOne({ where: { username } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const currentUser = await this.findById(id);

    /* If username is same as before, delete it from the dto */
    if (currentUser.username === updateUserDto.username) {
      delete updateUserDto.username;
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.username) {
      if (await this.findByUsername(updateUserDto.username)) {
        throw new HttpException(
          `User with username ${updateUserDto.username} is already exists`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return User.create({ id, ...updateUserDto }).save();
  }

  async delete(id: string): Promise<string> {
    await User.delete(await this.findById(id));
    return id;
  }

  async count(): Promise<number> {
    return await User.count();
  }

  /* Hash the refresh token and save it to the database */
  async setRefreshToken(id: string, refreshToken: string): Promise<void> {
    const user = await this.findById(id);
    await User.update(user, {
      refreshToken: refreshToken ? await bcrypt.hash(refreshToken, 10) : null,
    });
  }

  async findFavoriteCourses(userId: string): Promise<Course[]> {
    const user = await User.findOne({
      where: { id: userId },
      relations: ['favorites'], 
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.favorites;
  }

  async addFavoriteCourse(userId: string, courseId: string): Promise<User> {
    const user = await User.findOne({
      where: { id: userId },
      relations: ['favorites']
    });

    if (!user.favorites) user.favorites = [];

    const alreadyExists = user.favorites.some(c => c.id === courseId);
    if (alreadyExists) {
      throw new HttpException('Course already in favorites', HttpStatus.BAD_REQUEST);
    }

    const course = await this.courseService.findById(courseId);
    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }

    user.favorites.push(course);
    await user.save();

    return user;
  }

  async removeFavoriteCourse(userId: string, courseId: string): Promise<User> {
    const user = await User.findOne({
      where: { id: userId },
      relations: ['favorites']
    });

    if (!user.favorites) user.favorites = [];

    user.favorites = user.favorites.filter(c => c.id !== courseId);
    await user.save();

    return user;
  }

  async findInscriptionCourses(userId: string): Promise<Course[]> {
    const user = await User.findOne({
      where: { id: userId },
      relations: ['coursesInscription'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.coursesInscription;
  }

  async addInscriptionCourse(courseId: string, userId: string): Promise<User> {
    const user = await User.findOne({
      where: { id: userId },
      relations: ['coursesInscription']
    });

    if (!user.coursesInscription) user.coursesInscription = [];

    const alreadyExists = user.coursesInscription.some(c => c.id === courseId);
    if (alreadyExists) {
      throw new HttpException('Ya estás inscrito en este curso', HttpStatus.BAD_REQUEST);
    }

    const course = await this.courseService.findById(courseId);
    if (!course) {
      throw new HttpException('Curso no encontrado', HttpStatus.NOT_FOUND);
    }

    user.coursesInscription.push(course);
    await user.save();

    return user
  }

  async removeInscriptionCourse(courseId: string, userId: string): Promise<User> {
    const user = await User.findOne({
      where: { id: userId },
      relations: ['coursesInscription']
    });

    if (!user.coursesInscription) user.coursesInscription = [];

    // Filtrar el curso a desinscribir
    user.coursesInscription = user.coursesInscription.filter(c => c.id !== courseId);
    await user.save();

    return user;
  }

}
