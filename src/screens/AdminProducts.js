import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Loader2,
  ArrowLeft,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog } from '../components/ui/dialog';
import { Table } from '../components/ui/table';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../api/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState(null);

  const [productForm, setProductForm] = useState({
    productName: '',
    price: '',
    color: '',
    imageUrl: '',
    inStock: 'available'
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setImagePreview(base64String);
        setProductForm({...productForm, imageUrl: base64String});
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset image when dialog closes
  const resetImageUpload = () => {
    setSelectedImage(null);
    setImagePreview('');
  };

  const openAddDialog = () => {
    setEditingProduct(null);
    setProductForm({
      productName: '',
      price: '',
      color: '',
      imageUrl: '',
      inStock: 'available'
    });
    resetImageUpload();
    setIsDialogOpen(true);
  };

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
    
    // Check if we should auto-open the add product dialog
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('add') === 'true') {
      openAddDialog();
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price)
      };

      if (editingProduct) {
        const updateData = { ...productData, productId: editingProduct.productId };
        await updateProduct(updateData);
        alert('Product updated successfully');
      } else {
        await createProduct(productData);
        alert('Product created successfully');
      }

      setIsDialogOpen(false);
      setEditingProduct(null);
      setProductForm({
        name: '',
        price: '',
        category: '',
        image: '',
        description: ''
      });
      resetImageUpload();
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert(editingProduct ? 'Failed to update product' : 'Failed to create product');
    }
  };

  // Handle edit
  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      productName: product.productName || '',
      price: product.price ? product.price.toString() : '',
      color: product.color || '',
      imageUrl: product.imageUrl || '',
      inStock: product.inStock || 'available'
    });
    // Set image preview if there's an existing image
    if (product.imageUrl) {
      setImagePreview(product.imageUrl);
    } else {
      resetImageUpload();
    }
    setIsDialogOpen(true);
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
  const filteredProducts = products.filter(product =>
    product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.color?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '24px' 
      }}>
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
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
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
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              margin: '0',
              color: '#1f2937'
            }}>
              Manage Products
            </h1>
          </div>
        </div>
        
        <Button onClick={openAddDialog} style={{
          background: 'var(--primary)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Plus style={{ width: '16px', height: '16px' }} />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <Card style={{ 
        marginBottom: '24px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ padding: '16px 16px 8px 16px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            margin: '0',
            color: '#1f2937'
          }}>
            Search Products
          </h3>
        </div>
        <div style={{ padding: '0 16px 16px 16px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              width: '16px', 
              height: '16px', 
              color: '#9ca3af' 
            }} />
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
      <Card style={{ 
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ padding: '16px 16px 8px 16px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            margin: '0',
            color: '#1f2937'
          }}>
            Products ({filteredProducts.length})
          </h3>
        </div>
        <div style={{ padding: '0 16px 16px 16px' }}>
          {error ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '32px',
              color: '#dc2626'
            }}>
              <p style={{ fontSize: '16px', fontWeight: '600' }}>Error Loading Products</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>{error}</p>
              <Button 
                onClick={loadProducts} 
                style={{ marginTop: '16px' }}
              >
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              padding: '32px' 
            }}>
              <Loader2 style={{ 
                width: '32px', 
                height: '32px', 
                animation: 'spin 1s linear infinite',
                color: 'var(--primary)'
              }} />
            </div>
          ) : (
            <Table>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>ID</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Image</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Price</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Category</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.productId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1f2937' }}>
                      #{product.productId}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.productName}
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            objectFit: 'cover', 
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb'
                          }} 
                        />
                      ) : (
                        <div style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Package style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1f2937' }}>
                      {product.productName}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: '#059669' }}>
                      R{product.price}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>
                      <Badge variant="outline" style={{ 
                        padding: '4px 8px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {product.category}
                      </Badge>
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
              <Package style={{ 
                width: '48px', 
                height: '48px', 
                margin: '0 auto 16px',
                color: '#9ca3af'
              }} />
              <p style={{ color: '#6b7280', fontSize: '16px', fontWeight: '500' }}>
                No products found
              </p>
              {searchTerm && (
                <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '8px' }}>
                  Try adjusting your search term
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Add/Edit Product Dialog */}
      {isDialogOpen && (
        <Dialog onClose={() => setIsDialogOpen(false)}>
          <div style={{ 
            maxWidth: '500px', 
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                margin: '0',
                color: '#1f2937'
              }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                style={{ minWidth: 'auto', padding: '4px 8px' }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
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
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  required
                  style={{ marginTop: '8px' }}
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={productForm.category}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  required
                  style={{ marginTop: '8px' }}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  style={{ marginTop: '8px' }}
                />
              </div>
              
              <div>
                <Label htmlFor="imageUpload">Product Image</Label>
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{
                      padding: '8px',
                      cursor: 'pointer'
                    }}
                  />
                  {imagePreview && (
                    <div>
                      <Label style={{ fontSize: '14px', color: '#6b7280' }}>Preview:</Label>
                      <div style={{ 
                        marginTop: '8px', 
                        position: 'relative', 
                        width: '128px', 
                        height: '128px', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px', 
                        overflow: 'hidden' 
                      }}>
                        <img 
                          src={imagePreview} 
                          alt="Product preview" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            resetImageUpload();
                            setProductForm({...productForm, image: ''});
                          }}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            width: '24px',
                            height: '24px',
                            padding: '0',
                            minWidth: 'auto'
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  )}
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>
                    Upload an image file (max 5MB). Supported formats: JPG, PNG, GIF, WebP
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <Button type="submit" style={{ background: 'var(--primary)', border: 'none' }}>
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default AdminProducts;