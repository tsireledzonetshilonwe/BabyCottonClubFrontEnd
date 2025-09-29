import React from 'react';

export const Table = ({ children, className = "", ...props }) => {
  return (
    <div className="table-wrapper">
      <table className={`table ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children, className = "", ...props }) => {
  return (
    <thead className={`table-header ${className}`} {...props}>
      {children}
    </thead>
  );
};

export const TableBody = ({ children, className = "", ...props }) => {
  return (
    <tbody className={`table-body ${className}`} {...props}>
      {children}
    </tbody>
  );
};

export const TableRow = ({ children, className = "", ...props }) => {
  return (
    <tr className={`table-row ${className}`} {...props}>
      {children}
    </tr>
  );
};

export const TableHead = ({ children, className = "", ...props }) => {
  return (
    <th className={`table-head ${className}`} {...props}>
      {children}
    </th>
  );
};

export const TableCell = ({ children, className = "", ...props }) => {
  return (
    <td className={`table-cell ${className}`} {...props}>
      {children}
    </td>
  );
};