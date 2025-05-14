import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserGuard } from '../auth/guards/user.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.entity';
import { UserQuery } from './user.query';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.Admin)
  async save(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.save(createUserDto);
  }

  @Get()
  @Roles(Role.Admin)
  async findAll(@Query() userQuery: UserQuery): Promise<{ users: User[]; total: number }> {
    return await this.userService.findAll(userQuery);
  }

  @Get('/:id')
  @UseGuards(UserGuard)
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findById(id);
  }

  @Put('/:id')
  @UseGuards(UserGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  async delete(@Param('id') id: string): Promise<string> {
    return await this.userService.delete(id);
  }

  @Get(':id/favorites')
  findFavoriteCourses(@Param('id') userId: string) {
    return this.userService.findFavoriteCourses(userId);
  }

  @Put(':userId/favorites/:courseId')
  async addFavorite(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string
  ) {
    return this.userService.addFavoriteCourse(userId, courseId);
  }

  @Delete(':userId/favorites/:courseId')
  async removeFavorite(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string
  ) {
    return this.userService.removeFavoriteCourse(userId, courseId);
  }

  @Get(':id/inscription')
  findInscriptionCourses(@Param('id') userId: string) {
    return this.userService.findInscriptionCourses(userId);
  }

  @Put('/:userId/inscription/:courseId')
  async addInscription(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string
  ) {
    return this.userService.addInscriptionCourse(userId, courseId);
  }

  @Delete('/:userId/inscription/:courseId')
  async removeInscription(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string
  ) {
    return this.userService.removeInscriptionCourse(userId, courseId);
  }
}
