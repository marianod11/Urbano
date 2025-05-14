import { Loader, X } from 'react-feather';

import Modal from './Modal';

export function ModalUser({
  addUserShow,
  reset,
  setError,
  setAddUserShow,
  isSubmitting,
  error,
  register,
  handleSubmit,
  saveUser,
}) {
  return (
    <Modal show={addUserShow}>
      <div className="flex">
        <h1 className="font-semibold mb-3">Add User</h1>
        <button
          className="ml-auto focus:outline-none"
          onClick={() => {
            reset();
            setError(null);
            setAddUserShow(false);
          }}
        >
          <X size={30} />
        </button>
      </div>
      <hr />

      <form
        className="flex flex-col gap-5 mt-5"
        onSubmit={handleSubmit(saveUser)}
      >
        <div className="flex flex-col gap-5 sm:flex-row">
          <input
            type="text"
            className="input sm:w-1/2"
            placeholder="First Name"
            required
            disabled={isSubmitting}
            {...register('firstName')}
          />
          <input
            type="text"
            className="input sm:w-1/2"
            placeholder="Last Name"
            required
            disabled={isSubmitting}
            {...register('lastName')}
          />
        </div>
        <input
          type="text"
          className="input"
          required
          placeholder="Username"
          disabled={isSubmitting}
          {...register('username')}
        />
        <input
          type="password"
          className="input"
          required
          placeholder="Password (min 6 characters)"
          disabled={isSubmitting}
          {...register('password')}
        />
        <select
          className="input"
          required
          {...register('role')}
          disabled={isSubmitting}
        >
          <option value="user">User</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
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
