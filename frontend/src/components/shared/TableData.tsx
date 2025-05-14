import { Link } from 'react-router-dom';

import FavoriteButton from '../courses/FavoriteButton';
import InscriptionButton from '../courses/InscriptionButton';
import Table from './Table';
import TableItem from './TableItem';

export function TableData({
  data,
  tableColumns,
  isLoading,
  authenticatedUser,
  setSelected,
  setValue,
  setUpdateShow,
  setDeleteShow,
}) {
  return (
    <div className="table-container">
      <Table columns={tableColumns ? tableColumns : []}>
        {isLoading
          ? null
          : data &&
            data.map(({ id, name, description, dateCreated, path }) => {
              return (
                <tr key={id}>
                  <TableItem>
                    <img
                      src={path}
                      alt={name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </TableItem>
                  <TableItem>
                    <Link to={`/courses/${id}`}>{name}</Link>
                  </TableItem>
                  <TableItem>{description}</TableItem>
                  <TableItem>
                    {new Date(dateCreated).toLocaleDateString()}
                  </TableItem>
                  <TableItem className="flex items-center justify-end space-x-3">
                    <InscriptionButton
                      userId={authenticatedUser.id}
                      courseId={id}
                      className="text-xl focus:outline-none"
                    />

                    <FavoriteButton
                      userId={authenticatedUser.id}
                      courseId={id}
                      className="text-xl focus:outline-none"
                    />
                    {['admin', 'editor'].includes(authenticatedUser.role) && (
                      <button
                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                        onClick={() => {
                          setSelected(id);
                          setValue('name', name);
                          setValue('description', description);
                          setUpdateShow(true);
                        }}
                      >
                        Edit
                      </button>
                    )}

                    {authenticatedUser.role === 'admin' && (
                      <button
                        className="text-red-600 hover:text-red-900 focus:outline-none"
                        onClick={() => {
                          setSelected(id);
                          setDeleteShow(true);
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </TableItem>
                </tr>
              );
            })}
      </Table>
      {!isLoading && data.length < 1 ? (
        <div className="text-center my-5 text-gray-500">
          <h1>Empty</h1>
        </div>
      ) : null}
    </div>
  );
}
