import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { 
  ShoppingCart, 
  Users, 
  Package, 
  CreditCard, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  FileText
} from 'lucide-react';
import './App.css';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Update API base URL to deployed backend
const API_BASE_URL = '/api';

// Utility function for API calls
const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    let error;
    try {
      error = await response.json();
    } catch (e) {
      error = { error: response.statusText || 'API call failed' };
    }
    throw new Error(error.error || 'API call failed');
  }
  
  return response.json();
};

// Simple Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // You can log errorInfo here if needed
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, color: 'red', textAlign: 'center' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.message || 'Unknown error'}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Status badge component
const StatusBadge = ({ status, type = 'order' }) => {
  const getStatusColor = (status, type) => {
    if (type === 'order') {
      switch (status) {
        case 'unissued': return 'bg-gray-100 text-gray-800';
        case 'issued': return 'bg-blue-100 text-blue-800';
        case 'complete': return 'bg-green-100 text-green-800';
        case 'voided': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    } else if (type === 'payment') {
      switch (status) {
        case 'unpaid': return 'bg-red-100 text-red-800';
        case 'partial': return 'bg-yellow-100 text-yellow-800';
        case 'paid': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    } else if (type === 'fulfillment') {
      switch (status) {
        case 'unfulfilled': return 'bg-gray-100 text-gray-800';
        case 'partially_fulfilled': return 'bg-yellow-100 text-yellow-800';
        case 'fulfilled': return 'bg-green-100 text-green-800';
        case 'closed_short': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
  };

  return (
    <Badge className={getStatusColor(status, type)}>
      {status.replace('_', ' ').toUpperCase()}
    </Badge>
  );
};

// Hero Section component
const HeroSection = () => (
  <section
    className="relative flex items-center justify-center h-[400px] bg-header text-white overflow-hidden"
    style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
  >
    <div className="absolute inset-0 bg-black/60" />
    <div className="relative z-10 flex flex-col items-center text-center gap-6">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">SOFTWARE COMPANY SALES ORDER MANAGEMENT</h1>
      <p className="text-lg max-w-xl">A modern platform for development and software selling businesses. Manage your customers, orders, and products with ease.</p>
      <Link to="/register">
        <Button className="bg-accent text-white px-8 py-3 text-lg font-semibold rounded shadow hover:bg-accent-dark transition">Get Started</Button>
      </Link>
    </div>
  </section>
);

// Navigation component
const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: TrendingUp },
    { path: '/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/customers', label: 'Customers', icon: Users },
    { path: '/products', label: 'Products', icon: Package },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Sales Order Management</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === item.path
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Dashboard component
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const orders = await apiCall('/orders');
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(o => o.status === 'issued').length;
        const completedOrders = orders.filter(o => o.status === 'complete').length;
        const totalRevenue = orders
          .filter(o => o.status === 'complete')
          .reduce((sum, o) => sum + o.total_amount, 0);

        setStats({ totalOrders, pendingOrders, completedOrders, totalRevenue });
        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOrders}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest sales orders in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>{order.customer?.company_name}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} type="order" />
                  </TableCell>
                  <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                  <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// Orders component
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await apiCall('/orders');
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await apiCall('/customers');
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await apiCall('/products');
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer?.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOrderAction = async (orderId, action) => {
    try {
      await apiCall(`/orders/${orderId}/${action}`, { method: 'POST' });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        const updatedOrder = await apiCall(`/orders/${orderId}`);
        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      console.error(`Failed to ${action} order:`, error);
      alert(`Failed to ${action} order: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales Orders</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <CreateOrderForm 
              customers={customers} 
              products={products} 
              onSuccess={() => {
                setShowCreateDialog(false);
                fetchOrders();
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="unissued">Unissued</SelectItem>
            <SelectItem value="issued">Issued</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
            <SelectItem value="voided">Voided</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>{order.customer?.company_name}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} type="order" />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.payment_status} type="payment" />
                  </TableCell>
                  <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                  <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View
                      </Button>
                      {order.status === 'unissued' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOrderAction(order.id, 'issue')}
                        >
                          Issue
                        </Button>
                      )}
                      {order.status === 'issued' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOrderAction(order.id, 'complete')}
                        >
                          Complete
                        </Button>
                      )}
                      {(order.status === 'unissued' || order.status === 'issued') && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleOrderAction(order.id, 'void')}
                        >
                          Void
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedOrder && (
        <OrderDetailDialog
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={fetchOrders}
        />
      )}
    </div>
  );
};

// Create Order Form component
const CreateOrderForm = ({ customers, products, onSuccess }) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    delivery_address: '',
    line_items: []
  });

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      line_items: [...prev.line_items, { product_id: '', quantity: 1, unit_price: 0 }]
    }));
  };

  const updateLineItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      line_items: prev.line_items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeLineItem = (index) => {
    setFormData(prev => ({
      ...prev,
      line_items: prev.line_items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiCall('/orders', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to create order:', error);
      alert(`Failed to create order: ${error.message}`);
    }
  };

  const calculateTotal = () => {
    return formData.line_items.reduce((sum, item) => {
      return sum + (item.quantity * item.unit_price);
    }, 0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DialogHeader>
        <DialogTitle>Create New Order</DialogTitle>
        <DialogDescription>
          Create a new sales order for a customer
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customer">Customer</Label>
          <Select value={formData.customer_id} onValueChange={(value) => setFormData(prev => ({ ...prev, customer_id: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id.toString()}>
                  {customer.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="delivery_address">Delivery Address</Label>
          <Textarea
            id="delivery_address"
            value={formData.delivery_address}
            onChange={(e) => setFormData(prev => ({ ...prev, delivery_address: e.target.value }))}
            placeholder="Enter delivery address"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <Label>Line Items</Label>
          <Button type="button" onClick={addLineItem} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        {formData.line_items.map((item, index) => (
          <div key={index} className="grid grid-cols-5 gap-2 mb-2 items-end">
            <div>
              <Label>Product</Label>
              <Select 
                value={item.product_id} 
                onValueChange={(value) => {
                  const product = products.find(p => p.id.toString() === value);
                  updateLineItem(index, 'product_id', value);
                  updateLineItem(index, 'unit_price', product ? product.unit_price : 0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.product_name} (${product.unit_price})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value) || 0)}
                min="1"
              />
            </div>
            <div>
              <Label>Unit Price</Label>
              <Input
                type="number"
                step="0.01"
                value={item.unit_price}
                onChange={(e) => updateLineItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label>Total</Label>
              <Input
                value={`$${(item.quantity * item.unit_price).toFixed(2)}`}
                disabled
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeLineItem(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">
          Total: ${calculateTotal().toFixed(2)}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => onSuccess()}>
            Cancel
          </Button>
          <Button type="submit" disabled={!formData.customer_id || formData.line_items.length === 0}>
            Create Order
          </Button>
        </div>
      </div>
    </form>
  );
};

// Order Detail Dialog component
const OrderDetailDialog = ({ order, onClose, onUpdate }) => {
  const [payments, setPayments] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    if (order) {
      fetchPayments();
    }
  }, [order]);

  const fetchPayments = async () => {
    try {
      const data = await apiCall(`/orders/${order.id}/payments`);
      setPayments(data);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    }
  };

  const handlePayment = async (paymentData) => {
    try {
      await apiCall(`/orders/${order.id}/payments`, {
        method: 'POST',
        body: JSON.stringify(paymentData)
      });
      fetchPayments();
      onUpdate();
      setShowPaymentForm(false);
    } catch (error) {
      console.error('Failed to record payment:', error);
      alert(`Failed to record payment: ${error.message}`);
    }
  };

  const totalPaid = payments.reduce((sum, payment) => sum + payment.payment_amount, 0);
  const remainingBalance = order.total_amount - totalPaid;

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details - {order.order_number}</DialogTitle>
          <DialogDescription>
            Complete order information and management
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Order Details</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="fulfillment">Fulfillment</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Order Number:</strong> {order.order_number}</div>
                  <div><strong>Status:</strong> <StatusBadge status={order.status} type="order" /></div>
                  <div><strong>Payment Status:</strong> <StatusBadge status={order.payment_status} type="payment" /></div>
                  <div><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</div>
                  <div><strong>Total Amount:</strong> ${order.total_amount.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Company:</strong> {order.customer?.company_name}</div>
                  <div><strong>Contact:</strong> {order.customer?.contact_person}</div>
                  <div><strong>Email:</strong> {order.customer?.email}</div>
                  <div><strong>Phone:</strong> {order.customer?.phone}</div>
                </CardContent>
              </Card>
            </div>

            {order.delivery_address && (
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap">{order.delivery_address}</div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Line Items</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.line_items?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product?.product_name}</TableCell>
                        <TableCell>{item.product?.sku}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.unit_price.toFixed(2)}</TableCell>
                        <TableCell>${item.line_total.toFixed(2)}</TableCell>
                        <TableCell>
                          <StatusBadge status={item.fulfillment_status} type="fulfillment" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Payment History</h3>
                <p className="text-sm text-gray-600">
                  Total Paid: ${totalPaid.toFixed(2)} | Remaining: ${remainingBalance.toFixed(2)}
                </p>
              </div>
              {remainingBalance > 0 && (
                <Button onClick={() => setShowPaymentForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Record Payment
                </Button>
              )}
            </div>

            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                        <TableCell>${payment.payment_amount.toFixed(2)}</TableCell>
                        <TableCell>{payment.payment_method || 'N/A'}</TableCell>
                        <TableCell>{payment.reference_number || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {showPaymentForm && (
              <PaymentForm
                maxAmount={remainingBalance}
                onSubmit={handlePayment}
                onCancel={() => setShowPaymentForm(false)}
              />
            )}
          </TabsContent>

          <TabsContent value="fulfillment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fulfillment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Ordered</TableHead>
                      <TableHead>Fulfilled</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.line_items?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product?.product_name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.fulfilled_quantity}</TableCell>
                        <TableCell>{item.quantity - item.fulfilled_quantity}</TableCell>
                        <TableCell>
                          <StatusBadge status={item.fulfillment_status} type="fulfillment" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Payment Form component
const PaymentForm = ({ maxAmount, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    payment_amount: '',
    payment_method: '',
    reference_number: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      payment_amount: parseFloat(formData.payment_amount)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="payment_amount">Payment Amount</Label>
              <Input
                id="payment_amount"
                type="number"
                step="0.01"
                max={maxAmount}
                value={formData.payment_amount}
                onChange={(e) => setFormData(prev => ({ ...prev, payment_amount: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="payment_method">Payment Method</Label>
              <Input
                id="payment_method"
                value={formData.payment_method}
                onChange={(e) => setFormData(prev => ({ ...prev, payment_method: e.target.value }))}
                placeholder="e.g., Credit Card, Bank Transfer"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="reference_number">Reference Number</Label>
            <Input
              id="reference_number"
              value={formData.reference_number}
              onChange={(e) => setFormData(prev => ({ ...prev, reference_number: e.target.value }))}
              placeholder="Transaction reference or check number"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Record Payment</Button>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Customers component
const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await apiCall('/customers');
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customers</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <CustomerForm 
              onSuccess={() => {
                setShowCreateDialog(false);
                fetchCustomers();
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.company_name}</TableCell>
                  <TableCell>{customer.contact_person}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// Customer Form component
const CustomerForm = ({ customer, onSuccess }) => {
  const [formData, setFormData] = useState({
    company_name: customer?.company_name || '',
    contact_person: customer?.contact_person || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    billing_address: customer?.billing_address || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (customer) {
        await apiCall(`/customers/${customer.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiCall('/customers', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save customer:', error);
      alert(`Failed to save customer: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{customer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="company_name">Company Name</Label>
          <Input
            id="company_name"
            value={formData.company_name}
            onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="contact_person">Contact Person</Label>
          <Input
            id="contact_person"
            value={formData.contact_person}
            onChange={(e) => setFormData(prev => ({ ...prev, contact_person: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="billing_address">Billing Address</Label>
        <Textarea
          id="billing_address"
          value={formData.billing_address}
          onChange={(e) => setFormData(prev => ({ ...prev, billing_address: e.target.value }))}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit">{customer ? 'Update' : 'Create'} Customer</Button>
        <Button type="button" variant="outline" onClick={onSuccess}>Cancel</Button>
      </div>
    </form>
  );
};

// Products component
const Products = () => {
  const [products, setProducts] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await apiCall('/products');
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <ProductForm 
              onSuccess={() => {
                setShowCreateDialog(false);
                fetchProducts();
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.sku}</TableCell>
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell>${product.unit_price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={product.inventory_quantity > 0 ? 'default' : 'destructive'}>
                      {product.inventory_quantity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// Product Form component
const ProductForm = ({ product, onSuccess }) => {
  const [formData, setFormData] = useState({
    sku: product?.sku || '',
    product_name: product?.product_name || '',
    description: product?.description || '',
    unit_price: product?.unit_price || '',
    inventory_quantity: product?.inventory_quantity || 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (product) {
        await apiCall(`/products/${product.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiCall('/products', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert(`Failed to save product: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="product_name">Product Name</Label>
          <Input
            id="product_name"
            value={formData.product_name}
            onChange={(e) => setFormData(prev => ({ ...prev, product_name: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="unit_price">Unit Price</Label>
          <Input
            id="unit_price"
            type="number"
            step="0.01"
            value={formData.unit_price}
            onChange={(e) => setFormData(prev => ({ ...prev, unit_price: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="inventory_quantity">Inventory Quantity</Label>
          <Input
            id="inventory_quantity"
            type="number"
            value={formData.inventory_quantity}
            onChange={(e) => setFormData(prev => ({ ...prev, inventory_quantity: parseInt(e.target.value) || 0 }))}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit">{product ? 'Update' : 'Create'} Product</Button>
        <Button type="button" variant="outline" onClick={onSuccess}>Cancel</Button>
      </div>
    </form>
  );
};

// Main App component
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

