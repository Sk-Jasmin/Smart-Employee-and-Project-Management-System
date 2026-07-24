import React from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  striped?: boolean;
  hoverable?: boolean;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  id?: string;
}

import { EmptyState } from './EmptyState';

export function Table<T>({
  columns,
  data,
  striped = true,
  hoverable = true,
  keyExtractor,
  emptyMessage = 'No records matching your search or filter criteria.',
  id
}: TableProps<T>) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <div id={id} className="w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs">
      <table className="w-full text-xs text-slate-800 dark:text-slate-200 border-collapse min-w-[650px]">
        <thead className="bg-slate-100/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200 uppercase font-extrabold text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 backdrop-blur-xs">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={`px-4 py-3 ${alignClasses[col.align || 'left']}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/80 font-medium">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-0">
                <EmptyState
                  title="No Data Found"
                  description={emptyMessage}
                  icon="search"
                  className="border-none bg-transparent py-10"
                />
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={keyExtractor(row)}
                className={`transition-colors duration-150 ${
                  striped && idx % 2 === 1 ? 'bg-slate-50/70 dark:bg-slate-900/40' : 'bg-white dark:bg-slate-900'
                } ${hoverable ? 'hover:bg-indigo-50/50 dark:hover:bg-slate-800/70' : ''}`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 align-middle ${alignClasses[col.align || 'left']}`}
                  >
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
