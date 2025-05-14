import { useEffect, useState } from 'react';

import Course from '../../models/course/Course';
import ActionButton from '../utils/ActionButton';

interface Filter {
  name: string;
  description: string;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  totalPages: number;
  handlePageChange: (page: number) => void;
  sortBy: 'name' | 'description' | 'dateCreated';
  setSortBy: (sortBy: 'name' | 'description' | 'dateCreated') => void;
  sortOrder: 'ASC' | 'DESC';
  setSortOrder: (sortOrder: 'ASC' | 'DESC') => void;
  refetch: () => void;
  showFavorites?: boolean;
  setShowFavorites?: (showFavorites: boolean) => void;
  showInscribed?: boolean;
  setShowInscribed?: (showInscribed: boolean) => void;
}

export function TableFilter({
  name,
  description,
  setName,
  setDescription,
  page,
  setPage,
  pageSize,
  setPageSize,
  totalPages,
  handlePageChange,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  refetch,
  showFavorites,
  setShowFavorites,
  showInscribed,
  setShowInscribed,
}: Filter) {
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    setPage(1);
  };
  return (
    <div className="table-filter bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex flex-1 gap-4 w-full md:w-auto">
          <input
            type="text"
            className="input flex-1 min-w-[150px] border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setPage(1);
            }}
          />
          <input
            type="text"
            className="input flex-1 min-w-[150px] border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex items-center border rounded overflow-hidden">
            <select
              className="px-3 py-1 focus:outline-none"
              value={sortBy}
              onChange={(e) => {
                setSortBy(
                  e.target.value as 'name' | 'description' | 'dateCreated',
                );
                setPage(1);
              }}
            >
              <option value="name">Nombre</option>
              <option value="description">Descripción</option>
              <option value="dateCreated">Fecha</option>
            </select>
            <button
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
              onClick={toggleSortOrder}
            >
              {sortOrder === 'ASC' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">
          <div className="flex gap-4 items-center">
            <label>
              <input
                type="checkbox"
                checked={showFavorites}
                onChange={() => setShowFavorites(!showFavorites)}
              />
              Mostrar favoritos
            </label>

            <label>
              <input
                type="checkbox"
                checked={showInscribed}
                onChange={() => setShowInscribed(!showInscribed)}
              />
              Mostrar inscritos
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Anterior
            </button>
            <span className="text-sm whitespace-nowrap">
              Página {page} de {totalPages}
            </span>
            <button
              className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Siguiente
            </button>
          </div>

          <select
            className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {[1, 2, 5, 10].map((size) => (
              <option key={size} value={size}>
                {size} por página
              </option>
            ))}
          </select>
          <ActionButton title="Buscar" onClick={() => refetch()} />
        </div>
      </div>
    </div>
  );
}
