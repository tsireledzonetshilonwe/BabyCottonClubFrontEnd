// File: src/screens/AddProduct.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { createProduct } from '../api/api';
import './AddProduct.css';

const AddProduct = () => {
    const navigate = useNavigate();
    const [productForm, setProductForm] = useState({
        productName: '',
        price: '',
        category: '',
        description: '',
        imageUrl: '',
        inStock: 'available'
    });
    const [imagePreview, setImagePreview] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Please select an image smaller than 5MB');
            return;
        }
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = (ev) => {
            setImagePreview(ev.target.result);
            setProductForm((prev) => ({ ...prev, imageUrl: ev.target.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if admin is authenticated
        const admin = JSON.parse(localStorage.getItem("admin"));
        if (!admin || !admin.loggedIn) {
            alert("Please login as admin first");
            window.location.href = "/admin/login";
        }

        setIsSaving(true);
        try {
            if (selectedImage) {
                const form = new FormData();
                form.append('productName', productForm.productName);
                form.append('price', parseFloat(productForm.price || 0));
                form.append('category', productForm.category);
                form.append('description', productForm.description);
                form.append('inStock', productForm.inStock);
                form.append('image', selectedImage);

                await createProduct(form);
            } else {
                const payload = {
                    productName: productForm.productName,
                    price: parseFloat(productForm.price || 0),
                    category: productForm.category,
                    description: productForm.description,
                    inStock: productForm.inStock,
                    imageUrl: productForm.imageUrl
                };
                await createProduct(payload);
            }

            navigate('/admin/products');
        } catch (err) {
            console.error('Create product failed', err);
            if (err.response?.status === 403) {
                alert('Admin authentication failed. Please login again.');
                localStorage.removeItem('admin');
                localStorage.removeItem('adminToken');
                navigate('/admin/login');
            } else {
                alert(err.response?.data?.message || err.message || 'Failed to create product');
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={{ maxWidth: '720px', margin: '24px auto', padding: '16px' }}>
            <h1 style={{ marginBottom: '16px' }}>Add New Product</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                        id="productName"
                        value={productForm.productName}
                        onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
                        required
                        style={{ marginTop: '8px' }}
                    />
                </div>

                <div>
                    <Label htmlFor="price">Price (R)</Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        required
                        style={{ marginTop: '8px' }}
                    />
                </div>

                <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                        id="category"
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        required
                        style={{ marginTop: '8px' }}
                    />
                </div>


                <div>
                    <Label htmlFor="imageUpload">Product Image</Label>
                    {/* Use native input for file to ensure files is available */}
                    <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ marginTop: '8px', padding: '8px' }}
                    />
                    {imagePreview && (
                        <div style={{ marginTop: '8px' }}>
                            <div style={{ width: '128px', height: '128px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                                <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    <Button type="submit" style={{ background: 'var(--primary)', border: 'none' }} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Create Product'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;