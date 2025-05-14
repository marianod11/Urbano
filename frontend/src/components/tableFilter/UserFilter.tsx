import ActionButton from '../utils/ActionButton';
export function UserFilter({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  page,
  setPage,
  pageSize,
  setPageSize,
  totalPages,
  handlePageChange,
  username,
  setUsername,
  role,
  setRole,
  refetch,
}) {
  return (
    <div className="table-controls space-y-4 p-4 bg-white rounded-lg shadow-sm">
      {/* Fila 1: Filtros de búsqueda */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              className="input flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setPage(1);
              }}
            />
            <input
              type="text"
              className="input flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              className="input flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setPage(1);
              }}
            />
            <select
              className="input flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 border rounded-md bg-white text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Anterior
          </button>
          <span className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-4 py-2 border rounded-md bg-white text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Siguiente
          </button>
        </div>

        <div className="flex items-center gap-4">
          <select
            className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {[1, 2, 5, 10].map((size) => (
              <option key={size} value={size}>
                {size} por pagina
              </option>
            ))}
          </select>
          <ActionButton title="Buscar" onClick={() => refetch()} />
        </div>
      </div>
    </div>
  );
}
