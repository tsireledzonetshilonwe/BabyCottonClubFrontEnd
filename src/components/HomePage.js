// HomePage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../api/api';
import ProductCard from '../components/ProductCard';
import { resolveProductImage, normalizeLocalImage } from '../utils/images';
import { mapToCategory } from '../utils/categoryMapper';

const HomePage = () => {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchProducts();
                setProducts(Array.isArray(data) ? data : []);
            } catch (e) {
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const convertBackendProduct = (p) => {
        const reviewsArray = Array.isArray(p.reviews) ? p.reviews : [];
        const reviewCount = reviewsArray.length;
        const avgRating = reviewCount > 0
            ? reviewsArray.reduce((s, r) => s + (Number(r.rating) || 0), 0) / reviewCount
            : null;
        return {
            id: String(p.productId ?? p.id ?? ''),
            name: p.productName || p.name || 'Unnamed Product',
            price: p.price || 0,
            image: resolveProductImage(p),
            rating: avgRating != null ? Number(avgRating.toFixed(1)) : (p.rating || 4.0),
            reviewCount,
            category: mapToCategory({ name: p.productName || p.name, category: p.category?.categoryName }) || 'Other',
            // Use sizes from backend if available
            sizes: p.sizes && Array.isArray(p.sizes) && p.sizes.length > 0 
                ? p.sizes 
                : ['One Size'],
            colors: [p.color || 'Default'],
            description: p.description || `High-quality ${(p.productName || p.name || 'baby item').toLowerCase()} for your little one.`,
            inStock: p.inStock === 'available' || p.inStock === 'In Stock',
            backendData: p,
        };
    };

    const normalized = products.map(convertBackendProduct);
    const featured = normalized.slice(0, 4);

    const handleAddToCart = async (product) => {
        const p = product.backendData || {};
        try {
            const cartItem = {
                id: p.productId || product.id,
                name: p.productName || product.name,
                price: p.price ?? product.price,
                image: normalizeLocalImage(p.imageUrl || product.image) || product.image,
                quantity: 1,
            };
            
            // Include size if provided
            if (product.size) {
                cartItem.size = product.size;
            }
            
            await addToCart(cartItem);
        } catch (e) {
            console.error('Add to cart failed', e);
        }
    };

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

            {/* Categories section removed per request */}

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
                    {loading ? (
                        <p>Loading products...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : featured.length === 0 ? (
                        <p>No products available.</p>
                    ) : (
                        <div className="products-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))',
                            gap: '2rem',
                            maxWidth: '1200px',
                            margin: '0 auto'
                        }}>
                            {featured.map((product) => (
                                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} showViewButton={false} />
                            ))}
                        </div>
                    )}
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