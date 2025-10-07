import React from 'react';

export const Label = ({ htmlFor, children, className = "", ...props }) => {
  return (
    <label 
      htmlFor={htmlFor}
      className={`label ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};