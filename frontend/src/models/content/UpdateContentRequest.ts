export default interface UpdateContentRequest {
  name?: string;
  description?: string;
  file: FileList | null;
}
