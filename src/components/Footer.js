import React from "react";

function Footer() {
  return (
    <footer style={{ textAlign: 'center', padding: '1.5rem 0', fontFamily: 'Segoe UI, Arial, sans-serif', color: '#1a1a1a', background: 'linear-gradient(90deg, #a8dadc, #ffd6e0)', fontWeight: 500, fontSize: '1rem', borderTop: '1px solid #ffd6e0' }}>
      &copy; {new Date().getFullYear()} Baby Cotton Club | All Rights Reserved
    </footer>
  );
}

export default Footer;
