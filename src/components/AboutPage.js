import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <div className="about-page" style={{ minHeight: '80vh', padding: '4rem 0', background: '#fdf6f9' }}>
            <div className="container">
                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ color: '#f7b6d5', fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        About Baby Cotton Club
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#5D5D5D', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
                        We are passionate about providing the softest, most comfortable clothing for your little ones.
                        Our mission is to make parenting a little easier by offering high-quality, hypoallergenic baby clothes.
                    </p>
                </div>

                {/* Mission Section */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
                    <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
                        <i className="fas fa-heart" style={{ fontSize: '3rem', color: '#f7b6d5', marginBottom: '1.5rem' }}></i>
                        <h2 style={{ color: '#aee1f9', marginBottom: '1rem' }}>Our Mission</h2>
                        <p style={{ color: '#5D5D5D', lineHeight: '1.6' }}>
                            To provide parents with the highest quality, most comfortable baby clothing that is safe,
                            sustainable, and makes both babies and parents happy.
                        </p>
                    </div>

                    <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
                        <i className="fas fa-leaf" style={{ fontSize: '3rem', color: '#A5DD9B', marginBottom: '1.5rem' }}></i>
                        <h2 style={{ color: '#aee1f9', marginBottom: '1rem' }}>Our Values</h2>
                        <p style={{ color: '#5D5D5D', lineHeight: '1.6' }}>
                            We believe in using only 100% organic cotton, ethical manufacturing practices,
                            and creating products that are good for both babies and the environment.
                        </p>
                    </div>
                </div>

                {/* Team Section */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ color: '#f7b6d5', fontSize: '2.5rem', marginBottom: '3rem' }}>Why Choose Us</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                        {[
                            { icon: 'fa-baby', title: 'Baby-Soft Fabric', desc: '100% organic cotton that is gentle on sensitive skin' },
                            { icon: 'fa-shield-alt', title: 'Hypoallergenic', desc: 'Free from harsh chemicals and allergens' },
                            { icon: 'fa-truck', title: 'Fast Shipping', desc: 'Quick delivery across South Africa' },
                            { icon: 'fa-smile', title: 'Happy Guarantee', desc: 'We guarantee your baby will love our clothes' }
                        ].map((item, index) => (
                            <div key={index} style={{ background: '#fff', padding: '2rem', borderRadius: '10px', boxShadow: '0 3px 15px rgba(0,0,0,0.1)' }}>
                                <i className={`fas ${item.icon}`} style={{ fontSize: '2.5rem', color: '#aee1f9', marginBottom: '1rem' }}></i>
                                <h3 style={{ color: '#f7b6d5', marginBottom: '1rem' }}>{item.title}</h3>
                                <p style={{ color: '#5D5D5D' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div style={{ textAlign: 'center', background: '#fff', padding: '3rem', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#f7b6d5', marginBottom: '1rem' }}>Ready to Shop?</h2>
                    <p style={{ color: '#5D5D5D', marginBottom: '2rem' }}>
                        Discover our complete collection of baby clothing designed with love and care.
                    </p>
                    <Link to="/productspage" style={{
                        background: '#aee1f9',
                        color: '#fff',
                        textDecoration: 'none',
                        padding: '1rem 2rem',
                        borderRadius: '30px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        transition: 'background 0.3s ease'
                    }}
                          onMouseOver={(e) => e.target.style.background = '#8ecddb'}
                          onMouseOut={(e) => e.target.style.background = '#aee1f9'}>
                        Shop Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;