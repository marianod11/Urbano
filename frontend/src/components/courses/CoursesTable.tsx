import { useState } from 'react';
import { useForm } from 'react-hook-form';

import useAuth from '../../hooks/useAuth';
import Course from '../../models/course/Course';
import UpdateCourseRequest from '../../models/course/UpdateCourseRequest';
import CourseService from '../../services/CourseService';
import { ModalDelete } from '../shared/ModalDelete';
import { ModalUpdate } from '../shared/ModalUpdate';
import { TableData } from '../shared/TableData';

interface UsersTableProps {
  data: Course[];
  isLoading: boolean;
}

export default function CoursesTable({ data, isLoading }: UsersTableProps) {
  const { authenticatedUser } = useAuth();
  const [deleteShow, setDeleteShow] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>();
  const [error, setError] = useState<string>();
  const [updateShow, setUpdateShow] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateCourseRequest>();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await CourseService.delete(selectedCourseId);
      setDeleteShow(false);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (updateCourseRequest: UpdateCourseRequest) => {
    try {
      const { file } = updateCourseRequest;
      await CourseService.update(selectedCourseId, updateCourseRequest, file);
      setUpdateShow(false);
      reset();
      setError(null);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const tableColumns: string[] = ['', 'Name', 'Description', 'Created'];

  return (
    <>
      <TableData
        data={data && data}
        tableColumns={tableColumns}
        isLoading={isLoading}
        authenticatedUser={authenticatedUser}
        setSelected={setSelectedCourseId}
        setValue={setValue}
        setUpdateShow={setUpdateShow}
        setDeleteShow={setDeleteShow}
      />
      {/* Delete Course Modal */}
      <ModalDelete
        deleteShow={deleteShow}
        setError={setError}
        setDeleteShow={setDeleteShow}
        isDeleting={isDeleting}
        handleDelete={handleDelete}
        error={error}
      />
      {/* Update Course Modal */}
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
