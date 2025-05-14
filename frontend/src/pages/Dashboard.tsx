import { useQuery } from 'react-query';

import CardDashboard from '../components/dashboard/CardDashboard';
import { CardUniversal } from '../components/dashboard/CardUniversal';
import Header from '../components/header/header';
import Layout from '../components/layout';
import useAuth from '../hooks/useAuth';
import CourseService from '../services/CourseService';
import statsService from '../services/StatsService';

export default function Dashboard() {
  const { authenticatedUser } = useAuth();
  const { data, isLoading } = useQuery('stats', statsService.getStats);

  const { data: courses, isLoading: isLoadingCourses } = useQuery(
    ['courses'],
    () => CourseService.findAll({}),
    {
      refetchInterval: false,
    },
  );

  console.log(courses);

  return (
    <Layout>
      <Header title="Dashboard" />
      <hr />
      <div className="mt-5 flex flex-col gap-5">
        {!isLoading ? (
          <div className="flex flex-col sm:flex-row gap-5">
            {authenticatedUser?.role === 'admin' ? (
              <CardDashboard title="Users" data={data.numberOfUsers} />
            ) : (
              <></>
            )}
            <CardDashboard title="Courses" data={data.numberOfCourses} />
            <CardDashboard title="Contents" data={data.numberOfContents} />
          </div>
        ) : null}

        {authenticatedUser?.role !== 'admin' && (
          <CardUniversal
            isLoadingCourses={isLoadingCourses}
            courses={(courses && courses.courses) || []}
            tittle="Últimos cursos añadidos"
            error="Cargando cursos..."
          />
        )}
      </div>
    </Layout>
  );
}
