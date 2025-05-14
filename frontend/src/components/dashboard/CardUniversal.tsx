import CardCourses from './CardCourses';

export function CardUniversal({ isLoadingCourses, courses, tittle, error }) {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-3">{tittle}</h2>
      {!isLoadingCourses ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses &&
            courses
              ?.slice(0, 3)
              .map((course) => <CardCourses course={course} key={course.id} />)}
        </div>
      ) : (
        <p>{error}</p>
      )}
    </div>
  );
}
