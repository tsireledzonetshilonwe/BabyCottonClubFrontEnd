// File: src/screens/AdminProducts.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
    Package,
    Plus,
    Edit,
    Trash2,
    Search,
    Loader2,
    ArrowLeft
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Table } from '../components/ui/table';
import { fetchProducts, deleteProduct } from '../api/api';
import { resolveProductImage, IMAGE_PLACEHOLDER } from '../utils/images';

const AdminProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    // Load products
    const loadProducts = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const productsData = await fetchProducts();
            setProducts(productsData);
        } catch (error) {
            console.error('Error loading products:', error);
            setError('Failed to load products from backend');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // Handle edit
    const handleEdit = (product) => {
        navigate(`/admin/add-product?edit=${product.productId}`);
    };

    // Handle delete
    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(productId);
                alert('Product deleted successfully');
                loadProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product. Make sure the delete endpoint exists in your backend.');
            }
        }
    };

    // Filter products
    const filteredProducts = products.filter((product) =>
        (product.productName || product.name || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
        (product.category || product.color || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const computeProductImageSrc = (p) => {
        try {
            const raw = (p?.imageUrl || p?.image || '').trim();
            if (raw) {
                if (/^data:/i.test(raw) || /^https?:\/\//i.test(raw)) {
                    return raw;
                }
                const fileOnly = raw.startsWith('/') ? raw.slice(1) : raw;
                const normalizedFile = fileOnly.replaceAll('_', ' ');
                if (fileOnly.toLowerCase().startsWith('images/') || raw.toLowerCase().startsWith('/images/')) {
                    const path = normalizedFile.startsWith('images/') ? normalizedFile : `images/${normalizedFile}`;
                    return `/${path}`;
                }
                if (/^[^\\/]+\.(png|jpg|jpeg|gif|webp)$/i.test(fileOnly)) {
                    return `/images/${normalizedFile}`;
                }
                return raw.startsWith('/') ? raw : `/${raw}`;
            }
        } catch (e) {}
        return resolveProductImage(p);
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link
                        to="/admin/dashboard"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            backgroundColor: '#FFB6C1',
                            color: '#8B0000',
                            borderRadius: '8px',
                            border: '1px solid #FFB6C1',
                            fontSize: '14px',
                            fontWeight: '500',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#FF69B4';
                            e.target.style.borderColor = '#FF69B4';
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#FFB6C1';
                            e.target.style.borderColor = '#FFB6C1';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                        }}
                    >
                        <ArrowLeft style={{ width: '16px', height: '16px' }} />
                        Back to Dashboard
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Package style={{ width: '24px', height: '24px' }} />
                        <h1
                            style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                margin: '0',
                                color: '#1f2937',
                            }}
                        >
                            Manage Products
                        </h1>
                    </div>
                </div>

                {/* ✅ Updated Add Product Button */}
                <Button
                    onClick={() => navigate('/admin/add-product')}
                    style={{
                        backgroundColor: '#FFB6C1',
                        color: '#8B0000',
                        border: '1px solid #FFB6C1',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#FF69B4';
                        e.target.style.borderColor = '#FF69B4';
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#FFB6C1';
                        e.target.style.borderColor = '#FFB6C1';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    }}
                >
                    <Plus style={{ width: '18px', height: '18px' }} />
                    Add Product
                </Button>
            </div>

            {/* Search */}
            <Card
                style={{
                    marginBottom: '24px',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
            >
                <div style={{ padding: '16px 16px 8px 16px' }}>
                    <h3
                        style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            margin: '0',
                            color: '#1f2937',
                        }}
                    >
                        Search Products
                    </h3>
                </div>
                <div style={{ padding: '0 16px 16px 16px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search
                            style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '16px',
                                height: '16px',
                                color: '#9ca3af',
                            }}
                        />
                        <Input
                            placeholder="Search products by name or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>
                </div>
            </Card>

            {/* Products Table */}
            <Card
                style={{
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
            >
                <div style={{ padding: '16px 16px 8px 16px' }}>
                    <h3
                        style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            margin: '0',
                            color: '#1f2937',
                        }}
                    >
                        Products ({filteredProducts.length})
                    </h3>
                </div>
                <div style={{ padding: '0 16px 16px 16px' }}>
                    {error ? (
                        <div style={{ textAlign: 'center', padding: '32px', color: '#dc2626' }}>
                            <p style={{ fontSize: '16px', fontWeight: '600' }}>Error Loading Products</p>
                            <p style={{ fontSize: '14px', marginTop: '8px' }}>{error}</p>
                            <Button onClick={loadProducts} style={{ marginTop: '16px' }}>
                                Retry
                            </Button>
                        </div>
                    ) : isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
                            <Loader2
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    animation: 'spin 1s linear infinite',
                                    color: 'var(--primary)',
                                }}
                            />
                        </div>
                    ) : (
                        <Table>
                            <thead>
                            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ padding: '12px 16px', textAlign: 'left' }}>ID</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Image</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Name</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Price</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Category</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.productId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '12px 16px' }}>#{product.productId}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <img
                                            src={computeProductImageSrc(product)}
                                            onError={(e) => {
                                                e.currentTarget.src = IMAGE_PLACEHOLDER;
                                            }}
                                            alt={product.productName || product.name || 'Product image'}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                border: '1px solid #e5e7eb',
                                            }}
                                        />
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>{product.productName || product.name}</td>
                                    <td style={{ padding: '12px 16px', color: '#059669' }}>R{product.price}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <Badge variant="outline">{product.category}</Badge>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(product)}
                                                style={{ padding: '4px 8px', minWidth: 'auto' }}
                                            >
                                                <Edit style={{ width: '16px', height: '16px' }} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(product.productId)}
                                                style={{ padding: '4px 8px', minWidth: 'auto' }}
                                            >
                                                <Trash2 style={{ width: '16px', height: '16px' }} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    )}

                    {!isLoading && !error && filteredProducts.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '48px' }}>
                            <Package style={{ width: '48px', height: '48px', margin: '0 auto 16px', color: '#9ca3af' }} />
                            <p style={{ color: '#6b7280', fontSize: '16px' }}>No products found</p>
                            {searchTerm && (
                                <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '8px' }}>
                                    Try adjusting your search term
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AdminProducts;
