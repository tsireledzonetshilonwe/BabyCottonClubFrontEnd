import React, { useState } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

const Select = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (child?.type?.displayName === 'SelectTrigger') {
          return React.cloneElement(child, { 
            isOpen, 
            setIsOpen, 
            value 
          });
        }
        if (child?.type?.displayName === 'SelectContent') {
          return React.cloneElement(child, { 
            isOpen, 
            setIsOpen, 
            value, 
            onValueChange 
          });
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger = React.forwardRef(({ className, children, isOpen, setIsOpen, value, ...props }, ref) => (
  <button
    ref={ref}
    className={clsx(
      "select-trigger",
      className
    )}
    onClick={() => setIsOpen(!isOpen)}
    {...props}
  >
    {React.Children.map(children, child => {
      if (child?.type?.displayName === 'SelectValue') {
        return React.cloneElement(child, { value });
      }
      return child;
    })}
    <ChevronDown className="h-4 w-4 opacity-50" />
  </button>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({ placeholder, value }) => {
  return <span>{value || placeholder}</span>;
};
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef(({ className, children, isOpen, setIsOpen, value, onValueChange, ...props }, ref) => {
  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={clsx(
        "select-content",
        className
      )}
      {...props}
    >
      {React.Children.map(children, child => {
        if (child?.type?.displayName === 'SelectItem') {
          return React.cloneElement(child, { 
            setIsOpen, 
            value, 
            onValueChange 
          });
        }
        return child;
      })}
    </div>
  );
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef(({ className, children, value: itemValue, setIsOpen, onValueChange, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(
      "select-item",
      className
    )}
    onClick={() => {
      onValueChange(itemValue);
      setIsOpen(false);
    }}
    {...props}
  >
    {children}
  </div>
));
SelectItem.displayName = "SelectItem";

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };