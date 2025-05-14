import Course from '../models/course/Course';
import CreateUserRequest from '../models/user/CreateUserRequest';
import UpdateUserRequest from '../models/user/UpdateUserRequest';
import User from '../models/user/User';
import UserQuery from '../models/user/UserQuery';
import apiService from './ApiService';

class UserService {
  async save(createUserRequest: CreateUserRequest): Promise<void> {
    await apiService.post(`/api/users`, createUserRequest);
  }

  async findAll(
    userQuery: UserQuery,
  ): Promise<{ users: User[]; total: number }> {
    try {
      const users = await apiService.get<{
        users: User[];
        total: number;
      }>(`/api/users`, {
        params: userQuery,
      });
      return users.data;
    } catch (error) {
      return { users: [], total: 0 };
    }
  }

  async findOne(id: string): Promise<User> {
    return (await apiService.get<User>(`/api/users/${id}`)).data;
  }

  async update(
    id: string,
    updateUserRequest: UpdateUserRequest,
  ): Promise<void> {
    try {
      const {
        firstName,
        isActive,
        lastName,
        password,
        role,
        username,
      } = updateUserRequest;
      await apiService.put(`/api/users/${id}`, {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        username: username || undefined,
        role: role || undefined,
        isActive,
        password: password || undefined,
      });
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiService.delete(`/api/users/${id}`);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async addFavoriteCourse(userId: string, courseId: string): Promise<void> {
    try {
      await apiService.put(`/api/users/${userId}/favorites/${courseId}`);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async removeFavoriteCourse(userId: string, courseId: string): Promise<void> {
    try {
      await apiService.delete(`/api/users/${userId}/favorites/${courseId}`);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  async getFavoriteCourses(userId: string): Promise<Course[]> {
    return (await apiService.get<Course[]>(`/api/users/${userId}/favorites`))
      .data;
  }

  async getUserCourses(userId: string): Promise<Course[]> {
    return (await apiService.get<Course[]>(`/api/users/${userId}/inscription`))
      .data;
  }

  async getInscriptionCourses(userId: string): Promise<Course[]> {
    return (await apiService.get<Course[]>(`/api/users/${userId}/inscription`))
      .data;
  }

  async addInscriptionCourse(userId: string, courseId: string): Promise<void> {
    try {
      await apiService.put(`/api/users/${userId}/inscription/${courseId}`);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async removeInscriptionCourse(
    userId: string,
    courseId: string,
  ): Promise<void> {
    try {
      await apiService.delete(`/api/users/${userId}/inscription/${courseId}`);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}

export default new UserService();
