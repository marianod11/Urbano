export default interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  isActive: boolean;
  favoriteCourses?: { id: string }[];
  coursesInscription?: { id: string }[];
}
