import React from 'react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
    return (
        <div className="contact-page" style={{ minHeight: '80vh', padding: '4rem 0', background: '#fdf6f9' }}>
            <div className="container">
                {/* Header Section */}
                <div className="contact-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{
                        color: '#f7b6d5',
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem'
                    }}>
                        Get In Touch
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        color: '#5D5D5D',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }}>
                        We'd love to hear from you! Whether you have questions about our products,
                        need assistance with an order, or just want to say hello, we're here to help.
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'start',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    {/* Contact Information */}
                    <div className="contact-info" style={{
                        background: '#fff',
                        padding: '2rem',
                        borderRadius: '15px',
                        boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                        width: '100%',
                        maxWidth: '600px'
                    }}>
                        <h2 style={{
                            color: '#f7b6d5',
                            marginBottom: '2rem',
                            fontSize: '1.8rem',
                            fontWeight: '700',
                            textAlign: 'center'
                        }}>
                            Contact Information
                        </h2>

                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {/* Email Us */}
                            <div className="contact-item" style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    background: 'linear-gradient(135deg, #aee1f9, #8ECDDD)',
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 10px rgba(174, 225, 249, 0.3)',
                                    flexShrink: 0
                                }}>
                                    <i className="fas fa-envelope" style={{ color: '#fff', fontSize: '1.1rem' }}></i>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ color: '#5D5D5D', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: '600' }}>Email Us</h3>
                                    <p style={{ color: '#5D5D5D', margin: '0.2rem 0', fontSize: '1rem' }}>info@babycottonclub.com</p>
                                    <p style={{ color: '#5D5D5D', margin: '0.2rem 0', fontSize: '1rem' }}>support@babycottonclub.com</p>
                                </div>
                            </div>

                            {/* Call Us */}
                            <div className="contact-item" style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    background: 'linear-gradient(135deg, #f7b6d5, #ff9bb3)',
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 10px rgba(247, 182, 213, 0.3)',
                                    flexShrink: 0
                                }}>
                                    <i className="fas fa-phone" style={{ color: '#fff', fontSize: '1.1rem' }}></i>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ color: '#5D5D5D', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: '600' }}>Call Us</h3>
                                    <p style={{ color: '#5D5D5D', margin: '0.2rem 0', fontSize: '1rem' }}>+27 21 123 4567</p>
                                    <p style={{ color: '#5D5D5D', margin: '0.2rem 0', fontSize: '1rem' }}>Mon-Fri: 8:00 AM - 5:00 PM</p>
                                </div>
                            </div>

                            {/* Visit Us */}
                            <div className="contact-item" style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    background: 'linear-gradient(135deg, #A5DD9B, #8BC34A)',
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 10px rgba(165, 221, 155, 0.3)',
                                    flexShrink: 0
                                }}>
                                    <i className="fas fa-map-marker-alt" style={{ color: '#fff', fontSize: '1.1rem' }}></i>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ color: '#5D5D5D', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: '600' }}>Visit Us</h3>
                                    <p style={{ color: '#5D5D5D', margin: '0.2rem 0', fontSize: '1rem' }}>123 Cotton Street</p>
                                    <p style={{ color: '#5D5D5D', margin: '0.2rem 0', fontSize: '1rem' }}>Babyville, Cape Town 8001</p>
                                    <p style={{ color: '#5D5D5D', margin: '0.2rem 0', fontSize: '1rem' }}>South Africa</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="faq-section" style={{ marginTop: '4rem', textAlign: 'center' }}>
                    <h2 style={{ color: '#f7b6d5', marginBottom: '2rem', fontSize: '2.5rem', fontWeight: '700' }}>Frequently Asked Questions</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                        {[
                            { question: 'What is your return policy?', answer: 'We offer 30-day returns on all unworn items with original tags.' },
                            { question: 'How long does shipping take?', answer: 'Standard shipping takes 3-5 business days within South Africa.' },
                            { question: 'Are your products hypoallergenic?', answer: 'Yes! All our cotton products are hypoallergenic and chemical-free.' }
                        ].map((faq, index) => (
                            <div key={index} style={{
                                background: '#fff',
                                padding: '2rem',
                                borderRadius: '15px',
                                boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                                transition: 'transform 0.3s ease'
                            }}
                                 onMouseOver={(e) => e.target.style.transform = 'translateY(-5px)'}
                                 onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
                                <h3 style={{ color: '#aee1f9', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: '600' }}>{faq.question}</h3>
                                <p style={{ color: '#5D5D5D', lineHeight: '1.6', fontSize: '1rem' }}>{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                    <Link to="/about" style={{
                        display: 'inline-block',
                        marginTop: '2rem',
                        color: '#f7b6d5',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        transition: 'color 0.3s ease'
                    }}
                          onMouseOver={(e) => e.target.style.color = '#ff9bb3'}
                          onMouseOut={(e) => e.target.style.color = '#f7b6d5'}>
                        View More FAQs →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;