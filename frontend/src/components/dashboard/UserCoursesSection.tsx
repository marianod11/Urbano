import { ReactNode } from 'react';

import Course from '../../models/course/Course';
import CardCourses from './CardCourses';

interface UserCoursesSectionProps {
  title: string;
  courses: Course[];
  isLoading: boolean;
  emptyMessage: ReactNode | string;
  loadingMessage?: ReactNode | string;
  maxItems?: number;
  gridColumns?: string;
  renderItem?: (course: Course) => ReactNode;
}

export function UserCoursesSection({
  title,
  courses,
  isLoading,
  emptyMessage,
  loadingMessage = 'Cargando...',
  maxItems,
  gridColumns = 'md:grid-cols-2 lg:grid-cols-3',
  renderItem = (course) => <CardCourses course={course} />,
}: UserCoursesSectionProps) {
  const displayedCourses = maxItems ? courses.slice(0, maxItems) : courses;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {!isLoading ? (
        displayedCourses.length > 0 ? (
          <div className={`grid gap-4 ${gridColumns}`}>
            {displayedCourses.map((course) => (
              <div key={course.id}>{renderItem(course)}</div>
            ))}
          </div>
        ) : (
          <p>{emptyMessage}</p>
        )
      ) : (
        <p>{loadingMessage}</p>
      )}
    </div>
  );
}
