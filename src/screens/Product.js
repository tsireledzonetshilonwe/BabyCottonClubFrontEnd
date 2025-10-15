import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Filter, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { useDebounce } from '../hooks/useDebounce';
import { fetchProducts } from '../services/simpleApi';
import ProductCard from '../components/ProductCard';
import SimpleFilters from '../components/SimpleFilters';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState('all');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Use debounced search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Convert backend product to frontend product (memoized)
  const convertBackendProduct = useCallback((backendProduct) => {
    const converted = {
      id: backendProduct.productId?.toString() || '',
      name: backendProduct.productName || backendProduct.name || 'Unnamed Product',
      price: backendProduct.price || 0,
      image: backendProduct.imageUrl || require('../assets/img.png'),
      rating: backendProduct.reviews && backendProduct.reviews.length > 0 
        ? backendProduct.reviews[0].rating || 4.0 
        : 4.0,
      category: backendProduct.category?.categoryName || 'Baby Items',
      sizes: ['One Size'],
      colors: [backendProduct.color || 'Default'],
      description: backendProduct.description || `High-quality ${(backendProduct.productName || backendProduct.name || 'baby item').toLowerCase()} for your little one.`,
      inStock: backendProduct.inStock === 'available' || backendProduct.inStock === 'In Stock',
      backendData: backendProduct
    };
    
    return converted;
  }, []);

  // Load products from backend (memoized)
  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Loading products from backend...');
      
      const backendProducts = await fetchProducts();
      
      // Extract unique categories from products
      const backendCategories = ['all', ...new Set(backendProducts.map(product => 
        product.category?.categoryName || 'Baby Items'
      ))];
      
      console.log('Successfully loaded', backendProducts.length, 'products from backend');
      
      const convertedProducts = backendProducts.map(convertBackendProduct);
      setProducts(convertedProducts);
      
      setCategories(backendCategories);
      
      console.log('Products successfully loaded and converted');
      
    } catch (error) {
      console.error('Failed to load products:', error);
      setError(`Failed to load products: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast({
        title: 'Error',
        description: `Failed to load products: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [convertBackendProduct, toast]);

  // Load products on component mount and refresh when a review is created
  useEffect(() => {
    loadProducts();

    const onReviewCreated = (e) => {
      console.debug('Review created event, reloading products', e?.detail);
      loadProducts();
    };
    window.addEventListener('reviewCreated', onReviewCreated);

    return () => {
      window.removeEventListener('reviewCreated', onReviewCreated);
    };
  }, [loadProducts]);

  // Handle search parameter from URL
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  // Memoized filtered and sorted products for performance
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesPrice = priceRange === 'all' || 
          (priceRange === 'under25' && product.price < 25) ||
          (priceRange === '25to40' && product.price >= 25 && product.price <= 40) ||
          (priceRange === 'over40' && product.price > 40);
        
        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          default:
            return a.name.localeCompare(b.name);
        }
      });
  }, [products, debouncedSearchTerm, selectedCategory, priceRange, sortBy]);

  // Memoized add to cart handler
  const handleAddToCart = useCallback(async (product) => {
    if (!product.backendData) {
      toast({
        title: 'Error',
        description: 'Unable to add product to cart',
        variant: 'destructive',
      });
      return;
    }

    try {
      await addToCart({
        id: product.backendData.productId,
        name: product.backendData.productName || product.backendData.name,
        price: product.backendData.price,
        image: product.backendData.imageUrl
      });
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add item to cart',
        variant: 'destructive',
      });
    }
  }, [addToCart, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={loadProducts}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <SimpleFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Products</h1>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>{filteredProducts.length} products</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setPriceRange('all');
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
