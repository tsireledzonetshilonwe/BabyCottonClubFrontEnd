import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
        alert('Thank you for your message! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

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
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '3rem',
                    alignItems: 'start'
                }}>
                    {/* Contact Information */}
                    <div className="contact-info" style={{ background: '#fff', padding: '2.5rem', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ color: '#f7b6d5', marginBottom: '2rem', fontSize: '2rem' }}>Contact Information</h2>

                        <div className="contact-item" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <div style={{ background: '#aee1f9', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fas fa-envelope" style={{ color: '#fff', fontSize: '1.2rem' }}></i>
                            </div>
                            <div>
                                <h3 style={{ color: '#5D5D5D', marginBottom: '0.5rem' }}>Email Us</h3>
                                <p style={{ color: '#5D5D5D', margin: 0 }}>info@babycottonclub.com</p>
                                <p style={{ color: '#5D5D5D', margin: 0 }}>support@babycottonclub.com</p>
                            </div>
                        </div>

                        <div className="contact-item" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <div style={{ background: '#f7b6d5', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fas fa-phone" style={{ color: '#fff', fontSize: '1.2rem' }}></i>
                            </div>
                            <div>
                                <h3 style={{ color: '#5D5D5D', marginBottom: '0.5rem' }}>Call Us</h3>
                                <p style={{ color: '#5D5D5D', margin: 0 }}>+27 21 123 4567</p>
                                <p style={{ color: '#5D5D5D', margin: 0 }}>Mon-Fri: 8:00 AM - 5:00 PM</p>
                            </div>
                        </div>

                        <div className="contact-item" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <div style={{ background: '#A5DD9B', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fas fa-map-marker-alt" style={{ color: '#fff', fontSize: '1.2rem' }}></i>
                            </div>
                            <div>
                                <h3 style={{ color: '#5D5D5D', marginBottom: '0.5rem' }}>Visit Us</h3>
                                <p style={{ color: '#5D5D5D', margin: 0 }}>123 Cotton Street</p>
                                <p style={{ color: '#5D5D5D', margin: 0 }}>Babyville, Cape Town 8001</p>
                                <p style={{ color: '#5D5D5D', margin: 0 }}>South Africa</p>
                            </div>
                        </div>

                        <div className="social-links" style={{ marginTop: '2rem' }}>
                            <h3 style={{ color: '#5D5D5D', marginBottom: '1rem' }}>Follow Us</h3>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <a href="#" style={{ background: '#aee1f9', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                    <i className="fab fa-facebook-f" style={{ color: '#fff' }}></i>
                                </a>
                                <a href="#" style={{ background: '#f7b6d5', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                    <i className="fab fa-instagram" style={{ color: '#fff' }}></i>
                                </a>
                                <a href="#" style={{ background: '#A5DD9B', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                    <i className="fab fa-pinterest" style={{ color: '#fff' }}></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form" style={{ background: '#fff', padding: '2.5rem', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ color: '#f7b6d5', marginBottom: '2rem', fontSize: '2rem' }}>Send us a Message</h2>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', color: '#5D5D5D', fontWeight: '500' }}>
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.8rem',
                                                border: '2px solid #e0e0e0',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                transition: 'border-color 0.3s'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#aee1f9'}
                                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: '#5D5D5D', fontWeight: '500' }}>
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.8rem',
                                                border: '2px solid #e0e0e0',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                transition: 'border-color 0.3s'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#aee1f9'}
                                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" style={{ display: 'block', marginBottom: '0.5rem', color: '#5D5D5D', fontWeight: '500' }}>
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            border: '2px solid #e0e0e0',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            transition: 'border-color 0.3s'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#aee1f9'}
                                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', color: '#5D5D5D', fontWeight: '500' }}>
                                        Your Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            border: '2px solid #e0e0e0',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            resize: 'vertical',
                                            transition: 'border-color 0.3s',
                                            minHeight: '120px'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#aee1f9'}
                                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    style={{
                                        background: '#f7b6d5',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '1rem 2rem',
                                        borderRadius: '30px',
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        width: '100%'
                                    }}
                                    onMouseOver={(e) => e.target.style.background = '#ffa9c2'}
                                    onMouseOut={(e) => e.target.style.background = '#f7b6d5'}
                                >
                                    <i className="fas fa-paper-plane" style={{ marginRight: '0.5rem' }}></i>
                                    Send Message
                                </button>
                            </div>
                        </form>

                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                            <p style={{ margin: 0, color: '#5D5D5D', fontSize: '0.9rem' }}>
                                <i className="fas fa-clock" style={{ marginRight: '0.5rem', color: '#aee1f9' }}></i>
                                We typically respond within 24 hours during business days
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="faq-section" style={{ marginTop: '4rem', textAlign: 'center' }}>
                    <h2 style={{ color: '#f7b6d5', marginBottom: '2rem', fontSize: '2.5rem' }}>Frequently Asked Questions</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                        {[
                            { question: 'What is your return policy?', answer: 'We offer 30-day returns on all unworn items with original tags.' },
                            { question: 'How long does shipping take?', answer: 'Standard shipping takes 3-5 business days within South Africa.' },
                            { question: 'Are your products hypoallergenic?', answer: 'Yes! All our cotton products are hypoallergenic and chemical-free.' }
                        ].map((faq, index) => (
                            <div key={index} style={{ background: '#fff', padding: '2rem', borderRadius: '10px', boxShadow: '0 3px 15px rgba(0,0,0,0.1)' }}>
                                <h3 style={{ color: '#aee1f9', marginBottom: '1rem' }}>{faq.question}</h3>
                                <p style={{ color: '#5D5D5D', lineHeight: '1.6' }}>{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                    <Link to="/about" style={{
                        display: 'inline-block',
                        marginTop: '2rem',
                        color: '#f7b6d5',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                    }}>
                        View More FAQs →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;