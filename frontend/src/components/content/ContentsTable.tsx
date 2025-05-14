import { useState } from 'react';
import { useForm } from 'react-hook-form';

import useAuth from '../../hooks/useAuth';
import Content from '../../models/content/Content';
import UpdateContentRequest from '../../models/content/UpdateContentRequest';
import contentService from '../../services/ContentService';
import { ModalDelete } from '../shared/ModalDelete';
import { ModalUpdate } from '../shared/ModalUpdate';
import { TableData } from '../shared/TableData';

interface ContentsTableProps {
  data: Content[];
  courseId: string;
  isLoading: boolean;
}

export default function ContentsTable({
  data,
  isLoading,
  courseId,
}: ContentsTableProps) {
  const { authenticatedUser } = useAuth();
  const [deleteShow, setDeleteShow] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedContentId, setSelectedContentId] = useState<string>();
  const [error, setError] = useState<string>();
  const [updateShow, setUpdateShow] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateContentRequest>();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await contentService.delete(courseId, selectedContentId);
      setDeleteShow(false);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (updateContentRequest: UpdateContentRequest) => {
    try {
      await contentService.update(
        courseId,
        selectedContentId,
        updateContentRequest,
      );
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
        setSelected={setSelectedContentId}
        setValue={setValue}
        setUpdateShow={setUpdateShow}
        setDeleteShow={setDeleteShow}
      />

      {/* Delete Content Modal */}
      <ModalDelete
        deleteShow={deleteShow}
        setError={setError}
        setDeleteShow={setDeleteShow}
        isDeleting={isDeleting}
        handleDelete={handleDelete}
        error={error}
      />

      {/* Update Content Modal */}
      {selectedContentId ? (
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
      ) : null}
    </>
  );
}
