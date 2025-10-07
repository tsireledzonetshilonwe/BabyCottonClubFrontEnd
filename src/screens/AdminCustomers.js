import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Loader2,
  ArrowLeft,
  Eye,
  Edit,
  Mail,
  Phone
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Table } from '../components/ui/table';
import { fetchAllCustomers } from '../api/api';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // Load customers
  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const customersData = await fetchAllCustomers();
      console.debug('Raw customers response:', customersData);
      // Ensure we always work with an array
      const rawArray = Array.isArray(customersData) ? customersData : (customersData ? [customersData] : []);
      // Normalize/flatten each customer to avoid rendering huge nested graphs (orders -> customer -> orders ...)
      const normalized = rawArray.map(c => ({
        customerId: c.customerId ?? c.id,
        id: c.customerId ?? c.id,
        firstName: c.firstName ?? (c.name ? String(c.name).split(' ')[0] : ''),
        lastName: c.lastName ?? (c.name ? String(c.name).split(' ').slice(1).join(' ') : ''),
        name: c.name ?? `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim(),
        email: c.email ?? '',
        phoneNumber: c.phoneNumber ?? c.phone ?? '',
        createdAt: c.createdAt ?? c.joinDate ?? null,
      }));
      console.debug('Normalized customers:', normalized);
      setCustomers(normalized);
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      console.error('Error loading customers:', error);
      setError('Failed to load customers from backend');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // Filter customers
  const safeCustomers = Array.isArray(customers) ? customers : [];
  const filteredCustomers = safeCustomers.filter(customer =>
    (customer.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.lastName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.phoneNumber?.includes(searchTerm))
  );

  // Handle view customer details
  const handleViewDetails = (customer) => {
    const fullName = customer.name || `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
    alert(`Customer Details:
ID: ${customer.id || customer.customerId}
Name: ${fullName}
Email: ${customer.email}
Phone: ${customer.phoneNumber || 'N/A'}
Status: Active`);
  };

  // Calculate stats
  const totalCustomers = safeCustomers.length;
  const activeCustomers = safeCustomers.length; // Assuming all are active for now
  const newThisMonth = safeCustomers.filter(customer => {
    // Simple check - you can enhance this based on your date fields
    const customerDate = new Date(customer.createdAt || customer.joinDate || '2025-09-01');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return customerDate.getMonth() === currentMonth && customerDate.getFullYear() === currentYear;
  }).length;

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
            <Users style={{ width: '24px', height: '24px' }} />
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              margin: '0',
              color: '#1f2937'
            }}>
              Manage Customers
            </h1>
                <div style={{ marginLeft: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Button size="sm" onClick={loadCustomers}>Refresh</Button>
                  {lastUpdated && (
                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                      Last: {new Date(lastUpdated).toLocaleString()}
                    </div>
                  )}
                </div>
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
            Search Customers
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
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>
        </div>
      </Card>

      {/* Customers Table */}
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
            Customers ({filteredCustomers.length})
          </h3>
        </div>
        <div style={{ padding: '0 16px 16px 16px' }}>
          {error ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '32px',
              color: '#dc2626'
            }}>
              <p style={{ fontSize: '16px', fontWeight: '600' }}>Error Loading Customers</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>{error}</p>
              <Button 
                onClick={loadCustomers} 
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
                    ID
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Name
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Email
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Phone
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Status
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, idx) => {
                  const customerId = customer.id || customer.customerId;
                  const fullName = customer.name || `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
                  const rowKey = customerId ?? customer.email ?? fullName ?? `customer-${idx}`;
                  
                  return (
                    <tr key={rowKey} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ 
                        padding: '12px 16px', 
                        fontWeight: '500',
                        color: '#1f2937'
                      }}>
                        #{customerId}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: '500', color: '#1f2937' }}>
                          {fullName}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Mail style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
                          <span style={{ color: '#374151' }}>{customer.email}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Phone style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
                          <span style={{ color: '#374151' }}>
                            {customer.phoneNumber || customer.phone || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge 
                          variant="outline"
                          style={{ 
                            padding: '4px 8px',
                            borderRadius: '16px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#059669',
                            borderColor: '#059669'
                          }}
                        >
                          Active
                        </Badge>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(customer)}
                            style={{ 
                              padding: '4px 8px',
                              minWidth: 'auto'
                            }}
                          >
                            <Eye style={{ width: '16px', height: '16px' }} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              alert(`Edit functionality for customer ${fullName} would be implemented here`);
                            }}
                            style={{ 
                              padding: '4px 8px',
                              minWidth: 'auto'
                            }}
                          >
                            <Edit style={{ width: '16px', height: '16px' }} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
          
          {!isLoading && !error && filteredCustomers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <Users style={{ 
                width: '48px', 
                height: '48px', 
                margin: '0 auto 16px',
                color: '#9ca3af'
              }} />
              <p style={{ color: '#6b7280', fontSize: '16px', fontWeight: '500' }}>
                No customers found
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

      {/* Quick Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '16px' 
      }}>
        <Card style={{ 
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          background: 'linear-gradient(135deg, #A78BFA 0%, #C4B5FD 100%)'
        }}>
          <div style={{ padding: '16px 16px 8px 16px' }}>
            <h4 style={{ 
              fontSize: '14px', 
              fontWeight: '500', 
              margin: '0',
              color: 'white'
            }}>
              Total Customers
            </h4>
          </div>
          <div style={{ padding: '0 16px 16px 16px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>
              {totalCustomers}
            </div>
          </div>
        </Card>
        
        <Card style={{ 
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          background: 'linear-gradient(135deg, #34D399 0%, #6EE7B7 100%)'
        }}>
          <div style={{ padding: '16px 16px 8px 16px' }}>
            <h4 style={{ 
              fontSize: '14px', 
              fontWeight: '500', 
              margin: '0',
              color: 'white'
            }}>
              Active Customers
            </h4>
          </div>
          <div style={{ padding: '0 16px 16px 16px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>
              {activeCustomers}
            </div>
          </div>
        </Card>
        
        <Card style={{ 
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          background: 'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)'
        }}>
          <div style={{ padding: '16px 16px 8px 16px' }}>
            <h4 style={{ 
              fontSize: '14px', 
              fontWeight: '500', 
              margin: '0',
              color: 'white'
            }}>
              New This Month
            </h4>
          </div>
          <div style={{ padding: '0 16px 16px 16px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>
              {newThisMonth}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminCustomers;