import Course from '../models/course/Course';
import CourseQuery from '../models/course/CourseQuery';
import CreateCourseRequest from '../models/course/CreateCourseRequest';
import UpdateCourseRequest from '../models/course/UpdateCourseRequest';
import apiService from './ApiService';

class CourseService {
  async save(createCourseRequest: CreateCourseRequest): Promise<void> {
    try {
      const formData = new FormData();
      const { name, description, file } = createCourseRequest;

      formData.append('name', name);
      formData.append('description', description);
      formData.append('file', file[0]);

      await apiService.post(`/api/courses`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async findAll(
    courseQuery: CourseQuery,
  ): Promise<{ courses: Course[]; total: number }> {
    try {
      const courses = await apiService.get<{
        courses: Course[];
        total: number;
      }>(`/api/courses`, {
        params: courseQuery,
      });

      return courses.data;
    } catch (error) {
      return { courses: [], total: 0 };
    }
  }

  async findOne(id: string): Promise<Course> {
    return (await apiService.get<Course>(`/api/courses/${id}`)).data;
  }

  async update(
    id: string,
    updateCourseRequest: UpdateCourseRequest,
    file?: FileList,
  ): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('name', updateCourseRequest.name);
      formData.append('description', updateCourseRequest.description);
      if (file) {
        formData.append('file', file[0]);
      }
      await apiService.put(`/api/courses/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiService.delete(`/api/courses/${id}`);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}

export default new CourseService();
