import { Link } from 'react-router-dom';

import Course from '../../models/course/Course';

type Props = {
  course: Course;
};

export default function CardCourses({ course }: Props) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="border p-4 rounded shadow hover:shadow-md transition block"
    >
      <div className="flex items-start gap-4">
        {course.path && (
          <img
            src={course.path}
            alt={course.name}
            className="w-16 h-16 object-cover rounded"
          />
        )}

        <div className="flex flex-col">
          <h3 className="text-lg font-bold">{course.name}</h3>
          <p className="text-sm text-gray-600">{course.description}</p>
          <p className="text-sm text-gray-600">
            {new Date(course.dateCreated).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
