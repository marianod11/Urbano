import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';

import ContentsTable from '../components/content/ContentsTable';
import { PageForm } from '../components/form/PageForm';
import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import { TableFilter } from '../components/tableFilter/TableFilter';
import ActionButton from '../components/utils/ActionButton';
import useAuth from '../hooks/useAuth';
import CreateContentRequest from '../models/content/CreateContentRequest';
import contentService from '../services/ContentService';
import courseService from '../services/CourseService';

export default function Course() {
  const { id } = useParams<{ id: string }>();
  const { authenticatedUser } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'description' | 'dateCreated'>(
    'name',
  );
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [addContentShow, setAddContentShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const initialLoad = useRef(true);

  const userQuery = useQuery('user', async () => courseService.findOne(id));

  const {
    formState: { isSubmitting },
    reset,
  } = useForm<CreateContentRequest>();

  const { data, isLoading, refetch } = useQuery(
    ['contents', id, name, description, sortBy, sortOrder, page, pageSize],
    () =>
      contentService.findAll(id, {
        name: name || undefined,
        description: description || undefined,
        sortBy: sortBy,
        sortOrder: sortOrder,
        page: page,
        pageSize: pageSize,
      }),
    {
      refetchInterval: false,
      keepPreviousData: true,
      enabled: initialLoad.current,
      onSettled: () => {
        initialLoad.current = false;
      },
    },
  );

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const saveCourse = async (createContentRequest: CreateContentRequest) => {
    try {
      await contentService.save(id, createContentRequest);
      setAddContentShow(false);
      reset();
      setError(null);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const formMethods = useForm<CreateContentRequest>();

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">
        {!userQuery.isLoading ? `${userQuery.data.name} Contents` : ''}
      </h1>
      <hr />
      <div className="flex flex-row gap-5">
        {authenticatedUser.role !== 'user' ? (
          <ActionButton
            title="Add Content"
            onClick={() => setAddContentShow(true)}
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
      />

      <ContentsTable
        data={data && data.content}
        isLoading={isLoading}
        courseId={id}
      />

      {/* Add User Modal */}
      <Modal show={addContentShow}>
        <PageForm<CreateContentRequest>
          title="Add Content"
          form={formMethods}
          isSubmitting={isSubmitting}
          error={error}
          onClose={() => setAddContentShow(false)}
          onSubmit={saveCourse}
          fields={[
            {
              name: 'name',
              type: 'text',
              placeholder: 'Content Name',
              required: true,
            },
            {
              name: 'description',
              type: 'text',
              placeholder: 'Content Description',
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
