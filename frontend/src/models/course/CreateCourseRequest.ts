export default interface CreateCourseRequest {
  name: string;
  description: string;
  file: FileList | null;
}
