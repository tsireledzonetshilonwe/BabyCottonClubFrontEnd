import React, { useState, useRef, useEffect } from 'react';

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown-menu-wrapper" ref={dropdownRef} data-open={isOpen}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </div>
  );
};

const DropdownMenuTrigger = ({ children, asChild, isOpen, setIsOpen }) => {
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  if (asChild) {
    return React.cloneElement(children, { onClick: handleClick });
  }

  return (
    <button onClick={handleClick} className="dropdown-trigger">
      {children}
    </button>
  );
};

const DropdownMenuContent = ({ children, align = "start", className = "", isOpen }) => {
  if (!isOpen) return null;

  const alignClass = align === "end" ? "dropdown-content-end" : "dropdown-content-start";

  return (
    <div className={`dropdown-content ${alignClass} ${className}`}>
      <div className="dropdown-content-inner">
        {children}
      </div>
    </div>
  );
};

const DropdownMenuItem = ({ children, onClick, className = "" }) => {
  return (
    <div 
      className={`dropdown-item ${className}`}
      onClick={onClick}
      role="menuitem"
      tabIndex={0}
    >
      {children}
    </div>
  );
};

const DropdownMenuSeparator = ({ className = "" }) => {
  return <div className={`dropdown-separator ${className}`} />;
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};