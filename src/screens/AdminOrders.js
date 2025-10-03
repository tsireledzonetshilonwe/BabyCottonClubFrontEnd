import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Search, 
  Loader2,
  ArrowLeft,
  Eye
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Table } from '../components/ui/table';
import { fetchAllOrders, updateOrder, fetchAllCustomers } from '../api/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // Create mapping from order ID to customer ID
  const getCustomerIdForOrder = (orderId) => {
    for (const customer of customers) {
      if (customer.orders && customer.orders.some(order => order.orderId === orderId)) {
        return customer.customerId;
      }
    }
    return null;
  };

  // Load orders and customers
  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [ordersData, customersData] = await Promise.all([
        fetchAllOrders(),
        fetchAllCustomers()
      ]);
      setOrders(ordersData);
      setCustomers(customersData);
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders from backend');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const order = orders.find(o => o.orderId === orderId || o.id === orderId);
      if (order) {
        // Check if order has customer data
        if (!order.customer || !order.customer.customerId) {
          alert("Cannot update order: No customer associated with this order. Please assign a customer first.");
          return;
        }
        
        // Convert to CustomerOrderRequest DTO format that backend expects
        const updateRequest = {
          customerId: order.customer.customerId,
          orderDate: order.orderDate,
          totalAmount: order.totalAmount,
          status: newStatus,
          orderId: orderId
        };
        await updateOrder(orderId, updateRequest);
        
        // Update local state
        setOrders(prevOrders => 
          prevOrders.map(o => 
            (o.orderId === orderId || o.id === orderId) ? { ...o, status: newStatus } : o
          )
        );
        
        alert('Order status updated successfully');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const customerId = getCustomerIdForOrder(order.orderId);
    return (
      order.orderId?.toString().includes(searchTerm) ||
      order.orderDate?.includes(searchTerm) ||
      order.totalAmount?.toString().includes(searchTerm) ||
      customerId?.toString().includes(searchTerm)
    );
  });

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'outline';
      case 'processing': return 'default';
      case 'shipped': return 'secondary';
      case 'delivered': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const showOrderDetails = (order) => {
    const customerId = getCustomerIdForOrder(order.orderId);
    alert(`Order Details:
Order ID: ${order.orderId}
Customer ID: ${customerId || 'N/A'}
Amount: R${order.totalAmount}
Status: ${order.status || 'Pending'}
Date: ${order.orderDate}`);
  };

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
            <ShoppingCart style={{ width: '24px', height: '24px' }} />
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              margin: '0',
              color: '#1f2937'
            }}>
              Manage Orders
            </h1>
          </div>
        </div>
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
            Search Orders
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
              placeholder="Search by order ID, customer ID, date, or amount..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>
        </div>
      </Card>

      {/* Orders Table */}
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
            Orders ({filteredOrders.length})
          </h3>
        </div>
        <div style={{ padding: '0 16px 16px 16px' }}>
          {error ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '32px',
              color: '#dc2626'
            }}>
              <p style={{ fontSize: '16px', fontWeight: '600' }}>Error Loading Orders</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>{error}</p>
              <Button 
                onClick={loadOrders} 
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
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Order ID
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Customer ID
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Date
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Amount
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.orderId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ 
                      padding: '12px 16px', 
                      fontWeight: '500',
                      color: '#1f2937'
                    }}>
                      #{order.orderId}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>
                      {getCustomerIdForOrder(order.orderId) || 'N/A'}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>
                      {order.orderDate}
                    </td>
                    <td style={{ 
                      padding: '12px 16px', 
                      fontWeight: '600',
                      color: '#059669'
                    }}>
                      R{order.totalAmount}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge 
                        variant={getStatusColor(order.status || 'pending')}
                        style={{ 
                          padding: '4px 8px',
                          borderRadius: '16px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        {order.status || 'Pending'}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => showOrderDetails(order)}
                          style={{ 
                            padding: '4px 8px',
                            minWidth: 'auto'
                          }}
                        >
                          <Eye style={{ width: '16px', height: '16px' }} />
                        </Button>
                        <select
                          value={order.status || 'pending'}
                          onChange={(e) => handleStatusUpdate(order.orderId, e.target.value)}
                          style={{
                            fontSize: '12px',
                            padding: '4px 8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          
          {!isLoading && !error && filteredOrders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <ShoppingCart style={{ 
                width: '48px', 
                height: '48px', 
                margin: '0 auto 16px',
                color: '#9ca3af'
              }} />
              <p style={{ color: '#6b7280', fontSize: '16px', fontWeight: '500' }}>
                No orders found
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
    </div>
  );
};

export default AdminOrders;