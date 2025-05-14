import { useState } from 'react';
import { useForm } from 'react-hook-form';

import UpdateUserRequest from '../../models/user/UpdateUserRequest';
import User from '../../models/user/User';
import UserService from '../../services/UserService';
import { ModalDelete } from '../shared/ModalDelete';
import { ModalUpdate } from '../shared/ModalUpdate';
import Table from '../shared/Table';
import TableItem from '../shared/TableItem';

interface UsersTableProps {
  data: User[];
  isLoading: boolean;
}

export default function UsersTable({ data, isLoading }: UsersTableProps) {
  const [deleteShow, setDeleteShow] = useState<boolean>(false);
  const [updateShow, setUpdateShow] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const [error, setError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateUserRequest>();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await UserService.delete(selectedUserId);
      setDeleteShow(false);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (updateUserRequest: UpdateUserRequest) => {
    try {
      await UserService.update(selectedUserId, updateUserRequest);
      setUpdateShow(false);
      reset();
      setError(null);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <>
      <div className="table-container">
        <Table columns={['Name', 'Username', 'Status', 'Role', 'Created']}>
          {isLoading
            ? null
            : data &&
              data.map(
                ({ id, firstName, lastName, role, isActive, username }) => (
                  <tr key={id}>
                    <TableItem>{`${firstName} ${lastName}`}</TableItem>
                    <TableItem>{username}</TableItem>
                    <TableItem>
                      {isActive ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </TableItem>
                    <TableItem>{role}</TableItem>
                    <TableItem className="text-right">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                        onClick={() => {
                          setSelectedUserId(id);

                          setValue('firstName', firstName);
                          setValue('lastName', lastName);
                          setValue('username', username);
                          setValue('role', role);
                          setValue('isActive', isActive);

                          setUpdateShow(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 ml-3 focus:outline-none"
                        onClick={() => {
                          setSelectedUserId(id);
                          setDeleteShow(true);
                        }}
                      >
                        Delete
                      </button>
                    </TableItem>
                  </tr>
                ),
              )}
        </Table>

        {!isLoading && data.length < 1 ? (
          <div className="text-center my-5 text-gray-500">
            <h1>Empty</h1>
          </div>
        ) : null}
      </div>
      {/* Delete User Modal */}
      <ModalDelete
        deleteShow={deleteShow}
        setError={setError}
        setDeleteShow={setDeleteShow}
        isDeleting={isDeleting}
        handleDelete={handleDelete}
        error={error}
      />
      {/* Update User Modal */}
      <ModalUpdate
        updateShow={updateShow}
        setError={setError}
        setUpdateShow={setUpdateShow}
        isSubmitting={isSubmitting}
        error={error}
        reset={reset}
        handleSubmit={handleSubmit}
        register={register}
        handleUpdate={handleUpdate}
      />
    </>
  );
}
