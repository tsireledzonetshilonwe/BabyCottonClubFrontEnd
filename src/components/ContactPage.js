import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { subscribeToAlerts } from '../api/api';

const ContactPage = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');

    const handleSubscribe = async (e) => {
        e.preventDefault();
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setStatus('error');
            setMessage('Please enter your email address');
            return;
        }
        
        if (!emailRegex.test(email)) {
            setStatus('error');
            setMessage('Please enter a valid email address');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            await subscribeToAlerts(email);
            setStatus('success');
            setMessage('Thank you! You have been subscribed to our alerts.');
            setEmail('');
            
            setTimeout(() => {
                setStatus('');
                setMessage('');
            }, 5000);
        } catch (err) {
            setStatus('error');
            const errorMsg = err?.response?.data?.message || err?.message || 'Failed to subscribe. Please try again.';
            setMessage(errorMsg);
            
            setTimeout(() => {
                setStatus('');
                setMessage('');
            }, 5000);
        }
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
                                    <p style={{ color: '#5D5D5D', margin: '0.2rem 0', fontSize: '1rem' }}>(021) 436-6678</p>
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
                                    <p style={{ color: '#5D5D5D', margin: '0.2rem 0', fontSize: '1rem' }}>89 Kloof Street</p>
                                    <p style={{ color: '#5D5D5D', margin: '0.2rem 0', fontSize: '1rem' }}>Gardens, Cape Town 8001</p>
                                    <p style={{ color: '#5D5D5D', margin: '0.2rem 0', fontSize: '1rem' }}>South Africa</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Email Subscription Section */}
                <div className="subscription-section" style={{
                    marginTop: '4rem',
                    background: '#fff',
                    padding: '2.5rem',
                    borderRadius: '15px',
                    boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                    maxWidth: '600px',
                    margin: '4rem auto 0'
                }}>
                    <h3 style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: '600', 
                        marginBottom: '0.5rem', 
                        color: '#f7b6d5',
                        textAlign: 'center'
                    }}>Stay Updated</h3>
                    <p style={{ 
                        fontSize: '0.95rem', 
                        color: '#5D5D5D', 
                        marginBottom: '1.5rem', 
                        lineHeight: '1.4',
                        textAlign: 'center'
                    }}>
                        Subscribe to receive alerts about new products, special offers, and exclusive deals!
                    </p>
                    
                    <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                disabled={status === 'loading'}
                                style={{
                                    flex: '1',
                                    minWidth: '200px',
                                    padding: '0.75rem 1rem',
                                    border: status === 'error' ? '2px solid #dc3545' : '2px solid #e0e0e0',
                                    borderRadius: '6px',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.3s ease',
                                    backgroundColor: status === 'loading' ? '#f5f5f5' : '#fff',
                                    cursor: status === 'loading' ? 'not-allowed' : 'text'
                                }}
                                onFocus={(e) => {
                                    if (status !== 'error') {
                                        e.target.style.borderColor = '#87CEEB';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(135, 206, 235, 0.1)';
                                    }
                                }}
                                onBlur={(e) => {
                                    if (status !== 'error') {
                                        e.target.style.borderColor = '#e0e0e0';
                                        e.target.style.boxShadow = 'none';
                                    }
                                }}
                            />
                            <button 
                                type="submit" 
                                disabled={status === 'loading'}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: status === 'loading' ? '#b0b0b0' : '#87CEEB',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseOver={(e) => {
                                    if (status !== 'loading') {
                                        e.target.style.backgroundColor = '#6DB8DB';
                                        e.target.style.transform = 'translateY(-1px)';
                                        e.target.style.boxShadow = '0 4px 8px rgba(135, 206, 235, 0.3)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (status !== 'loading') {
                                        e.target.style.backgroundColor = '#87CEEB';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }
                                }}
                            >
                                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </div>
                        
                        {message && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1rem',
                                borderRadius: '6px',
                                fontSize: '0.9rem',
                                backgroundColor: status === 'success' ? '#d4edda' : '#f8d7da',
                                color: status === 'success' ? '#155724' : '#721c24',
                                border: status === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
                                animation: 'slideIn 0.3s ease'
                            }}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                    {status === 'success' ? '✓' : '✗'}
                                </span>
                                <span>{message}</span>
                            </div>
                        )}
                    </form>
                </div>

                {/* FAQ Section */}
                <div className="faq-section" style={{ marginTop: '4rem', textAlign: 'center' }}>
                    <h2 style={{ color: '#f7b6d5', marginBottom: '2rem', fontSize: '2.5rem', fontWeight: '700' }}>Frequently Asked Questions</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                        {[
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