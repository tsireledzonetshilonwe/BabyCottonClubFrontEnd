import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  Eye,
  Plus,
  Loader2
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { fetchProducts, fetchAllOrders, fetchAllCustomers } from '../api/api';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all data in parallel from real backend API
        const [products, orders, customers] = await Promise.all([
          fetchProducts(),
          fetchAllOrders(),
          fetchAllCustomers()
        ]);

        // Create mapping from order ID to customer
        const getCustomerForOrder = (orderId) => {
          for (const customer of customers) {
            if (customer.orders && customer.orders.some(order => order.orderId === orderId)) {
              return customer;
            }
          }
          return null;
        };

        // Calculate revenue from orders (using totalAmount field)
        const totalRevenue = orders.reduce((sum, order) => {
          return sum + (order.totalAmount || 0);
        }, 0);

        // Get recent orders (last 5, sorted by date)
        const recentOrders = orders
          .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
          .slice(0, 5)
          .map(order => {
            const customer = getCustomerForOrder(order.orderId);
            return {
              id: order.orderId,
              customerName: customer ? `${customer.firstName} ${customer.lastName}` : `Customer ${customer?.customerId || 'N/A'}`,
              amount: order.totalAmount || 0,
              status: order.status || 'pending',
              date: order.orderDate
            };
          });

        setStats({
          totalOrders: orders.length,
          totalProducts: products.length,
          totalCustomers: customers.length,
          totalRevenue: Math.round(totalRevenue * 100) / 100, // Round to 2 decimal places
          recentOrders
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    if (!status) return 'default';
    
    switch (status.toLowerCase()) {
      case 'processing':
      case 'pending':
        return 'default';
      case 'shipped':
        return 'secondary';
      case 'delivered':
      case 'completed':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="admin-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <Loader2 style={{ width: '48px', height: '48px', animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
        <p style={{ fontSize: '16px', color: '#6b7280' }}>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '18px', color: '#dc2626', fontWeight: '600', marginBottom: '8px' }}>Error Loading Dashboard</p>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">
            <Package style={{ width: '28px', height: '28px' }} />
            Admin Dashboard
          </h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>Welcome to your admin control panel</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button 
            variant="outline"
            onClick={() => {
              window.location.href = '/admin/products?add=true';
            }}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              border: '1px solid var(--primary)',
              color: 'var(--primary)',
              backgroundColor: 'transparent',
              borderRadius: '6px',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        <Card style={{ background: 'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)', border: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', padding: '16px 16px 8px 16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'white', margin: 0 }}>Total Orders</h3>
            <ShoppingCart style={{ width: '20px', height: '20px', color: 'white' }} />
          </div>
          <div style={{ padding: '0 16px 16px 16px' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: 'white' }}>{stats.totalOrders}</div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
              <TrendingUp style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} />
              Total customer orders
            </p>
          </div>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #8ECDDD 0%, #A0E4F1 100%)', border: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', padding: '16px 16px 8px 16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'white', margin: 0 }}>Total Products</h3>
            <Package style={{ width: '20px', height: '20px', color: 'white' }} />
          </div>
          <div style={{ padding: '0 16px 16px 16px' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: 'white' }}>{stats.totalProducts}</div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
              Products in catalog
            </p>
          </div>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #A78BFA 0%, #C4B5FD 100%)', border: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', padding: '16px 16px 8px 16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'white', margin: 0 }}>Total Customers</h3>
            <Users style={{ width: '20px', height: '20px', color: 'white' }} />
          </div>
          <div style={{ padding: '0 16px 16px 16px' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: 'white' }}>{stats.totalCustomers}</div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
              Registered users
            </p>
          </div>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #34D399 0%, #6EE7B7 100%)', border: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', padding: '16px 16px 8px 16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'white', margin: 0 }}>Total Revenue</h3>
            <TrendingUp style={{ width: '20px', height: '20px', color: 'white' }} />
          </div>
          <div style={{ padding: '0 16px 16px 16px' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: 'white' }}>R{stats.totalRevenue.toLocaleString()}</div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
              <TrendingUp style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} />
              Total sales revenue
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card style={{ 
        marginTop: '32px',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 8px 16px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>Recent Orders</h3>
          <Link 
            to="/admin/orders"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
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
            <Eye style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            View All Orders
          </Link>
        </div>
        <div style={{ padding: '0 16px 16px 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div key={order.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '20px', 
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  border: '1px solid #e2e8f0', 
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: 'var(--primary)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <ShoppingCart style={{ width: '20px', height: '20px', color: 'white' }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', fontSize: '16px', margin: '0 0 4px 0', color: '#1f2937' }}>{order.customerName}</p>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>Order #{order.id} • {order.date}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: '700', fontSize: '18px', margin: '0 0 8px 0', color: '#059669' }}>R{order.amount}</p>
                    <Badge variant={getStatusColor(order.status)} style={{ 
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
                <ShoppingCart style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: '0.3' }} />
                <p style={{ fontSize: '16px', fontWeight: '500' }}>No recent orders found</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>Orders will appear here once customers start purchasing</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card style={{ 
        marginTop: '32px',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid #f1f5f9'
      }}>
        <div style={{ padding: '16px 16px 8px 16px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>Quick Actions</h3>
        </div>
        <div style={{ padding: '0 16px 16px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <Button asChild style={{ 
              height: 'auto', 
              padding: '24px', 
              flexDirection: 'column', 
              background: 'var(--primary)',
              border: 'none',
              borderRadius: '12px'
            }}>
              <Link to="/admin/products">
                <Package style={{ width: '32px', height: '32px', marginBottom: '12px', color: 'white' }} />
                <span style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: 'white' }}>Products</span>
                <span style={{ fontSize: '14px', opacity: '0.9', color: 'white' }}>Manage products catalog</span>
              </Link>
            </Button>
            
            <Button asChild style={{ 
              height: 'auto', 
              padding: '24px', 
              flexDirection: 'column',
              background: '#8ECDDD',
              border: 'none',
              borderRadius: '12px'
            }}>
              <Link to="/admin/orders">
                <ShoppingCart style={{ width: '32px', height: '32px', marginBottom: '12px', color: 'white' }} />
                <span style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: 'white' }}>Orders</span>
                <span style={{ fontSize: '14px', opacity: '0.9', color: 'white' }}>Order management</span>
              </Link>
            </Button>
            
            <Button asChild style={{ 
              height: 'auto', 
              padding: '24px', 
              flexDirection: 'column',
              background: '#A78BFA',
              border: 'none',
              borderRadius: '12px'
            }}>
              <Link to="/admin/customers">
                <Users style={{ width: '32px', height: '32px', marginBottom: '12px', color: 'white' }} />
                <span style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: 'white' }}>Customers</span>
                <span style={{ fontSize: '14px', opacity: '0.9', color: 'white' }}>Customer information</span>
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AdminDashboard;