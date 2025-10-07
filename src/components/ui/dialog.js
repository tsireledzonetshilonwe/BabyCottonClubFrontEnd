import React, { useState, useRef, useEffect } from 'react';

const Dialog = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(open);
  const dialogRef = useRef(null);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        onOpenChange && onOpenChange(false);
      }
    };

    const handleClickOutside = (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target) && isOpen) {
        setIsOpen(false);
        onOpenChange && onOpenChange(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onOpenChange]);

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div ref={dialogRef} className="dialog-content">
        {React.Children.map(children, child =>
          React.cloneElement(child, { onClose: () => {
            setIsOpen(false);
            onOpenChange && onOpenChange(false);
          }})
        )}
      </div>
    </div>
  );
};

const DialogTrigger = ({ children, asChild }) => {
  if (asChild) {
    return children;
  }
  return <button className="dialog-trigger">{children}</button>;
};

const DialogContent = ({ children, className = "" }) => {
  return (
    <div className={`dialog-inner ${className}`}>
      {children}
    </div>
  );
};

const DialogHeader = ({ children, className = "" }) => {
  return (
    <div className={`dialog-header ${className}`}>
      {children}
    </div>
  );
};

const DialogTitle = ({ children, className = "" }) => {
  return (
    <h2 className={`dialog-title ${className}`}>
      {children}
    </h2>
  );
};

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
};