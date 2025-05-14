import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import Header from '../components/header/header';
import Layout from '../components/layout';
import { ModalUser } from '../components/shared/ModalUser';
import { UserFilter } from '../components/tableFilter/UserFilter';
import UsersTable from '../components/users/UsersTable';
import ActionButton from '../components/utils/ActionButton';
import useAuth from '../hooks/useAuth';
import CreateUserRequest from '../models/user/CreateUserRequest';
import userService from '../services/UserService';

export default function Users() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'description' | 'dateCreated'>(
    'name',
  );
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const initialLoadUser = useRef(true);

  const [addUserShow, setAddUserShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const { data, isLoading, refetch } = useQuery(
    [
      'users',
      firstName,
      lastName,
      username,
      role,
      sortBy,
      sortOrder,
      page,
      pageSize,
    ],
    async () => {
      return await userService.findAll({
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        username: username || undefined,
        role: role || undefined,
        sortBy,
        sortOrder,
        page,
        pageSize,
      });
    },
    {
      refetchInterval: false,
      keepPreviousData: true,
      enabled: initialLoadUser.current,
      onSettled: () => {
        initialLoadUser.current = false;
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
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateUserRequest>();

  const saveUser = async (createUserRequest: CreateUserRequest) => {
    try {
      await userService.save(createUserRequest);
      setAddUserShow(false);
      setError(null);
      reset();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <Layout>
      <Header title="Manage Users" />
      <hr />
      <div className="flex flex-row gap-5">
        <ActionButton title="Add User" onClick={() => setAddUserShow(true)} />
      </div>

      <UserFilter
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        username={username}
        setUsername={setUsername}
        role={role}
        setRole={setRole}
        refetch={refetch}
      />

      <UsersTable data={data && data.users} isLoading={isLoading} />

      {/* Add User Modal */}
      <ModalUser
        addUserShow={addUserShow}
        reset={reset}
        setError={setError}
        setAddUserShow={setAddUserShow}
        isSubmitting={isSubmitting}
        error={error}
        register={register}
        handleSubmit={handleSubmit}
        saveUser={saveUser}
      />
    </Layout>
  );
}
