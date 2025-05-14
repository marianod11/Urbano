import { useQuery } from 'react-query';

import CardCourses from '../components/dashboard/CardCourses';
import { CardUniversal } from '../components/dashboard/CardUniversal';
import Header from '../components/header/header';
import Layout from '../components/layout';
import useAuth from '../hooks/useAuth';
import UserService from '../services/UserService';

export default function UserData() {
  const { authenticatedUser } = useAuth();
  const {
    data: favoriteCourses = [],
    isLoading: isLoadingFavorites,
  } = useQuery(
    ['favoriteCourses', authenticatedUser?.id],
    () => UserService.getFavoriteCourses(authenticatedUser.id),
    {
      enabled: !!authenticatedUser?.id,
    },
  );

  const {
    data: inscribedCourses = [],
    isLoading: isLoadingInscriptions,
  } = useQuery(
    ['inscriptionCourses', authenticatedUser?.id],
    () => UserService.getInscriptionCourses(authenticatedUser.id),
    {
      enabled: !!authenticatedUser?.id,
    },
  );

  return (
    <Layout>
      <Header title="Dashboard" />
      <hr />
      <div className="mt-5 flex flex-col gap-5">
        {authenticatedUser?.role !== 'admin' && (
          <div className="mt-10">
            <CardUniversal
              isLoadingCourses={isLoadingFavorites}
              courses={favoriteCourses || []}
              tittle="Tus cursos favoritos"
              error="No tenés cursos favoritos aún."
            />
            <CardUniversal
              isLoadingCourses={isLoadingInscriptions}
              courses={inscribedCourses || []}
              tittle="Tus inscripciones"
              error="No tenés inscripciones aún."
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
