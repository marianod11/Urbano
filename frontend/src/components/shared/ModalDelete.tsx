import { AlertTriangle, Loader } from 'react-feather';

import Modal from './Modal';

export function ModalDelete({
  deleteShow,
  setError,
  setDeleteShow,
  isDeleting,
  handleDelete,
  error,
}) {
  return (
    <Modal show={deleteShow}>
      <AlertTriangle size={30} className="text-red-500 mr-5 fixed" />
      <div className="ml-10">
        <h3 className="mb-2 font-semibold">Delete Content</h3>
        <hr />
        <p className="mt-2">
          Are you sure you want to delete the content? All of content's data
          will be permanently removed.
          <br />
          This action cannot be undone.
        </p>
      </div>
      <div className="flex flex-row gap-3 justify-end mt-5">
        <button
          className="btn"
          onClick={() => {
            setError(null);
            setDeleteShow(false);
          }}
          disabled={isDeleting}
        >
          Cancel
        </button>
        <button
          className="btn danger"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? <Loader className="mx-auto animate-spin" /> : 'Delete'}
        </button>
      </div>
      {error ? (
        <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
          {error}
        </div>
      ) : null}
    </Modal>
  );
}
