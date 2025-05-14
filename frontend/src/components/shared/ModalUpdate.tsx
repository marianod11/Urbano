import { Loader, X } from 'react-feather';

import Modal from './Modal';

export function ModalUpdate({
  updateShow,
  setError,
  setUpdateShow,
  isSubmitting,
  error,
  reset,
  handleSubmit,
  register,
  handleUpdate,
}) {
  return (
    <Modal show={updateShow}>
      <div className="flex">
        <h1 className="font-semibold mb-3">Update User</h1>
        <button
          className="ml-auto focus:outline-none"
          onClick={() => {
            setUpdateShow(false);
            setError(null);
            reset();
          }}
        >
          <X size={30} />
        </button>
      </div>
      <hr />

      <form
        className="flex flex-col gap-5 mt-5"
        onSubmit={handleSubmit(handleUpdate)}
      >
        <div className="flex flex-col gap-5 sm:flex-row">
          <input
            type="text"
            className="input sm:w-1/2"
            placeholder="First Name"
            {...register('firstName')}
          />
          <input
            type="text"
            className="input sm:w-1/2"
            placeholder="Last Name"
            disabled={isSubmitting}
            {...register('lastName')}
          />
        </div>
        <input
          type="text"
          className="input"
          placeholder="Username"
          disabled={isSubmitting}
          {...register('username')}
        />
        <input
          type="password"
          className="input"
          placeholder="Password"
          disabled={isSubmitting}
          {...register('password')}
        />
        <select className="input" {...register('role')} disabled={isSubmitting}>
          <option value="user">User</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        <div>
          <label className="font-semibold mr-3">Active</label>
          <input
            type="checkbox"
            className="input w-5 h-5"
            {...register('isActive')}
          />
        </div>
        <button
          className="btn bg-brand-primary hover:bg-red-hover font-roboto"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader className="animate-spin mx-auto" /> : 'Save'}
        </button>
        {error ? (
          <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
            {error}
          </div>
        ) : null}
      </form>
    </Modal>
  );
}
