import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import CoursesTable from '../components/courses/CoursesTable';
import { PageForm } from '../components/form/PageForm';
import Header from '../components/header/header';
import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import { TableFilter } from '../components/tableFilter/TableFilter';
import ActionButton from '../components/utils/ActionButton';
import useAuth from '../hooks/useAuth';
import CreateCourseRequest from '../models/course/CreateCourseRequest';
import courseService from '../services/CourseService';
import UserService from '../services/UserService';

export default function Courses() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'description' | 'dateCreated'>(
    'name',
  );
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [showInscribed, setShowInscribed] = useState<boolean>(false);

  const [addCourseShow, setAddCourseShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const initialLoadCourse = useRef(true);

  const { authenticatedUser } = useAuth();
  const { data, isLoading, refetch } = useQuery(
    ['courses', name, description, sortBy, sortOrder, page, pageSize],
    () =>
      courseService.findAll({
        name: name || undefined,
        description: description || undefined,
        sortBy: sortBy,
        sortOrder: sortOrder,
        page: page,
        pageSize: pageSize,
        userId:
          showFavorites || showInscribed ? authenticatedUser?.id : undefined,
        favorite: showFavorites,
        inscribed: showInscribed,
      }),
    {
      refetchInterval: false,
      keepPreviousData: true,
      enabled: initialLoadCourse.current,
      onSettled: () => {
        initialLoadCourse.current = false;
      },
    },
  );

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const {
    formState: { isSubmitting },
    reset,
  } = useForm<CreateCourseRequest>();

  const saveCourse = async (createCourseRequest: CreateCourseRequest) => {
    try {
      await courseService.save(createCourseRequest);
      setAddCourseShow(false);
      reset();
      setError(null);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const formMethods = useForm<CreateCourseRequest>();

  return (
    <Layout>
      <Header title="Manage Courses" />
      <hr />
      <div className="flex flex-row gap-5">
        {authenticatedUser.role !== 'user' ? (
          <ActionButton
            title="Add Course"
            onClick={() => setAddCourseShow(true)}
          />
        ) : null}
      </div>

      <TableFilter
        name={name}
        description={description}
        setName={setName}
        setDescription={setDescription}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        refetch={refetch}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        showInscribed={showInscribed}
        setShowInscribed={setShowInscribed}
      />

      <CoursesTable data={data && data.courses} isLoading={isLoading} />

      {/* Add User Modal */}
      <Modal show={addCourseShow}>
        <PageForm<CreateCourseRequest>
          title="Add Course"
          form={formMethods}
          isSubmitting={isSubmitting}
          error={error}
          onClose={() => setAddCourseShow(false)}
          onSubmit={saveCourse}
          fields={[
            {
              name: 'name',
              type: 'text',
              placeholder: 'Course Name',
              required: true,
            },
            {
              name: 'description',
              type: 'text',
              placeholder: 'Course Description',
              required: true,
            },
            {
              name: 'file',
              type: 'file',
              placeholder: 'Upload image',
              accept: 'image/*',
            },
          ]}
        />
      </Modal>
    </Layout>
  );
}
