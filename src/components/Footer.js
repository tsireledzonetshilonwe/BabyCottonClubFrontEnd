// Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Baby Cotton Club</h3>
                        <p>Soft, comfortable, and adorable clothing for your little ones. Because happy babies make happy parents!</p>
                    </div>

                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <Link to="/">Home</Link>
                        <Link to="/productspage">Products</Link>
                        <Link to="/about">About Us</Link>
                        <Link to="/contact">Contact</Link>
                    </div>

                    <div className="footer-section">
                        <h3>Contact Us</h3>
                        <p>Email: info@babycottonclub.com</p>
                        <p>Phone: (021) 436-6678</p>
                        <p>Cape Town, South Africa</p>
                    </div>

                    <div className="footer-section">
                        <h3>Follow Us</h3>
                        <div className="social-links">
                            <a href="#"><i className="fab fa-facebook"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-pinterest"></i></a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2025 Baby Cotton Club. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;