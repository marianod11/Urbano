import Content from '../models/content/Content';
import ContentQuery from '../models/content/ContentQuery';
import CreateContentRequest from '../models/content/CreateContentRequest';
import UpdateContentRequest from '../models/content/UpdateContentRequest';
import apiService from './ApiService';

class ContentService {
  async findAll(
    courseId: string,
    contentQuery: ContentQuery,
  ): Promise<{ content: Content[]; total: number }> {
    try {
      const content = await apiService.get<{
        content: Content[];
        total: number;
      }>(`/api/courses/${courseId}/contents`, {
        params: contentQuery,
      });
      return content.data;
    } catch (error) {
      return { content: [], total: 0 };
    }
  }

  async save(
    courseId: string,
    createContentRequest: CreateContentRequest,
  ): Promise<void> {
    try {
      const formData = new FormData();
      const { name, description, file } = createContentRequest;
      formData.append('name', name);
      formData.append('description', description);
      formData.append('file', file[0]);
      await apiService.post(`/api/courses/${courseId}/contents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async update(
    courseId: string,
    id: string,
    updateCourseRequest: UpdateContentRequest,
    file?: FileList,
  ): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('name', updateCourseRequest.name);
      formData.append('description', updateCourseRequest.description);
      if (file) {
        formData.append('file', file[0]);
      }
      await apiService.put(
        `/api/courses/${courseId}/contents/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async delete(courseId: string, id: string): Promise<void> {
    try {
      await apiService.delete(`/api/courses/${courseId}/contents/${id}`);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}

export default new ContentService();
