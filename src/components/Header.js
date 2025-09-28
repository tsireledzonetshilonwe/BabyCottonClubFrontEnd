import React from 'react';

const Header = ({ currentPage, setCurrentPage }) => {
  return (
    <header>
      <div className="container header-content">
        <div className="logo">
          <h1>BABY COTTON CLUB<span>Comfy Clothes | Happy Babies</span></h1>
        </div>
      </div>
    </header>
  );
};

export default Header;