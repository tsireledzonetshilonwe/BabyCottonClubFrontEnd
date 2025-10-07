// HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="homepage-main">
            {/* Hero Section */}
            <section className="hero" style={{
                background: 'linear-gradient(135deg, #fdf6f9 0%, #fff9fc 100%)',
                padding: '4rem 0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{
                        color: '#f7b6d5',
                        fontWeight: 'bold',
                        fontSize: '3rem',
                        marginBottom: '1.5rem',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        Welcome to Baby Cotton Club
                    </h1>
                    <p style={{
                        fontSize: '1.3rem',
                        color: '#5D5D5D',
                        marginBottom: '2.5rem',
                        maxWidth: '800px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        lineHeight: '1.6'
                    }}>
                        Discover our collection of super soft, 100% cotton clothing designed for your baby's comfort and happiness.
                        Because happy babies make happy parents!
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '20px',
                        justifyContent: 'center',
                        marginBottom: '2rem',
                        flexWrap: 'wrap'
                    }}>
                        <Link to="/products" className="btn btn-primary" style={{
                            background: '#aee1f9',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '30px',
                            padding: '1rem 2.5rem',
                            fontSize: '1.1rem',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease'
                        }}>
                            <i className="fas fa-shopping-bag"></i> Shop Now
                        </Link>
                        <Link to="/about" className="btn btn-secondary" style={{
                            background: 'transparent',
                            color: '#aee1f9',
                            border: '2px solid #aee1f9',
                            borderRadius: '30px',
                            padding: '1rem 2.5rem',
                            fontSize: '1.1rem',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease'
                        }}>
                            <i className="fas fa-info-circle"></i> Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories" style={{
                padding: '4rem 0',
                background: '#fff',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2 style={{
                        color: '#f7b6d5',
                        fontWeight: 'bold',
                        fontSize: '2.5rem',
                        marginBottom: '3rem'
                    }}>
                        Shop by Category
                    </h2>
                    <div className="categories-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        maxWidth: '1000px',
                        margin: '0 auto'
                    }}>
                        <div className="category-card" style={{
                            background: '#fdf6f9',
                            padding: '2rem',
                            borderRadius: '15px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                            transition: 'transform 0.3s ease'
                        }}>
                            <h3 style={{ color: '#f7b6d5', marginBottom: '1rem' }}>Newborn</h3>
                            <p style={{ color: '#5D5D5D' }}>Soft clothing for 0-3 months</p>
                        </div>
                        <div className="category-card" style={{
                            background: '#fdf6f9',
                            padding: '2rem',
                            borderRadius: '15px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                            transition: 'transform 0.3s ease'
                        }}>
                            <h3 style={{ color: '#f7b6d5', marginBottom: '1rem' }}>Baby Boys</h3>
                            <p style={{ color: '#5D5D5D' }}>Adorable outfits for little gentlemen</p>
                        </div>
                        <div className="category-card" style={{
                            background: '#fdf6f9',
                            padding: '2rem',
                            borderRadius: '15px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                            transition: 'transform 0.3s ease'
                        }}>
                            <h3 style={{ color: '#f7b6d5', marginBottom: '1rem' }}>Baby Girls</h3>
                            <p style={{ color: '#5D5D5D' }}>Pretty clothes for little princesses</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="featured-products" style={{
                background: 'linear-gradient(135deg, #fff9fc 0%, #fdf6f9 100%)',
                padding: '4rem 0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2 style={{
                        color: '#f7b6d5',
                        fontWeight: 'bold',
                        fontSize: '2.5rem',
                        marginBottom: '3rem'
                    }}>
                        Featured Products
                    </h2>
                    <div className="products-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem',
                        maxWidth: '1200px',
                        margin: '0 auto'
                    }}>
                        {[
                            { name: 'Organic Cotton Bodysuit', price: 'R149.99', icon: 'fa-tshirt' },
                            { name: 'Soft Sole Booties', price: 'R89.99', icon: 'fa-socks' },
                            { name: 'Animal Print Romper', price: 'R199.99', icon: 'fa-mitten' },
                            { name: 'Sun Protection Hat', price: 'R119.99', icon: 'fa-hat-cowboy' }
                        ].map((product, index) => (
                            <div key={index} className="product-item" style={{
                                background: '#fff',
                                borderRadius: '15px',
                                padding: '2rem',
                                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                                transition: 'transform 0.3s ease',
                                border: '1px solid #f0f0f0'
                            }}>
                                <i className={`fas ${product.icon}`} style={{
                                    fontSize: '3.5rem',
                                    color: '#f7b6d5',
                                    marginBottom: '1rem'
                                }}></i>
                                <h3 style={{
                                    fontWeight: 'bold',
                                    marginBottom: '0.5rem',
                                    color: '#5D5D5D'
                                }}>{product.name}</h3>
                                <p style={{
                                    color: '#aee1f9',
                                    fontWeight: 'bold',
                                    marginBottom: '1.5rem',
                                    fontSize: '1.2rem'
                                }}>{product.price}</p>
                                <Link to="/products" className="btn-cart" style={{
                                    background: '#f7b6d5',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '25px',
                                    padding: '0.8rem 1.5rem',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    transition: 'background 0.3s ease',
                                    textDecoration: 'none',
                                    display: 'inline-block'
                                }}>
                                    <i className="fas fa-cart-plus"></i> View Product
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="why-choose-us" style={{
                padding: '4rem 0',
                background: '#fff',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2 style={{
                        color: '#f7b6d5',
                        fontWeight: 'bold',
                        fontSize: '2.5rem',
                        marginBottom: '2rem'
                    }}>
                        Why Choose Baby Cotton Club?
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        color: '#5D5D5D',
                        maxWidth: '800px',
                        margin: '0 auto 3rem',
                        lineHeight: '1.6'
                    }}>
                        At Baby Cotton Club, we believe that your baby deserves the softest, most comfortable clothing
                        made from 100% premium cotton. Our clothes are designed with both style and functionality in mind,
                        making diaper changes easier and playtime more comfortable.
                    </p>
                    <Link to="/about" className="btn btn-primary" style={{
                        background: '#aee1f9',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '30px',
                        padding: '1rem 2.5rem',
                        fontSize: '1.1rem',
                        textDecoration: 'none'
                    }}>
                        Learn More About Us
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;