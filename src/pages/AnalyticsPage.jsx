import React, { useState, useEffect } from 'react';
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
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Users,
  Package,
  Target,
  Plus, 
  Search, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  AlertTriangle,
  Activity,
  Award,
  Calendar
} from 'lucide-react';

// API base URL
const API_BASE_URL = 'https://sales-order-backend-v1-2.azurewebsites.net/api';

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

// Trend indicator component
const TrendIndicator = ({ value, label, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    purple: 'text-purple-600 bg-purple-50'
  };

  return (
    <div className={`p-4 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {Icon && <Icon className="w-8 h-8 opacity-60" />}
      </div>
    </div>
  );
};

// Business Metrics Component
const BusinessMetricsTab = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const data = await apiCall('/analytics/metrics');
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch business metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading business metrics...</div>;
  }

  if (!metrics) {
    return <div className="flex justify-center py-8">No metrics data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Business Metrics Overview</h3>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Sales Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Sales Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <TrendIndicator
              value={`$${metrics.sales_metrics.total_sales_today.toFixed(2)}`}
              label="Sales Today"
              icon={DollarSign}
              color="green"
            />
            <TrendIndicator
              value={`$${metrics.sales_metrics.total_sales_this_month.toFixed(2)}`}
              label="Sales This Month"
              icon={TrendingUp}
              color="blue"
            />
            <TrendIndicator
              value={`$${metrics.sales_metrics.total_sales_this_year.toFixed(2)}`}
              label="Sales This Year"
              icon={BarChart3}
              color="purple"
            />
            <TrendIndicator
              value={`$${metrics.sales_metrics.average_order_value.toFixed(2)}`}
              label="Average Order Value"
              icon={Target}
              color="yellow"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <TrendIndicator
              value={metrics.sales_metrics.orders_today}
              label="Orders Today"
              icon={Activity}
              color="green"
            />
            <TrendIndicator
              value={metrics.sales_metrics.orders_this_month}
              label="Orders This Month"
              icon={Activity}
              color="blue"
            />
            <TrendIndicator
              value={metrics.sales_metrics.orders_this_year}
              label="Orders This Year"
              icon={Activity}
              color="purple"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Customer Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <TrendIndicator
              value={metrics.customer_metrics.total_customers}
              label="Total Customers"
              icon={Users}
              color="blue"
            />
            <TrendIndicator
              value={metrics.customer_metrics.new_customers_this_month}
              label="New Customers (Month)"
              icon={TrendingUp}
              color="green"
            />
            <TrendIndicator
              value={metrics.customer_metrics.active_customers}
              label="Active Customers"
              icon={CheckCircle}
              color="green"
            />
            <TrendIndicator
              value={`${metrics.customer_metrics.customer_retention_rate}%`}
              label="Retention Rate"
              icon={Award}
              color="purple"
            />
          </div>
        </CardContent>
      </Card>

      {/* Product Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Product Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <TrendIndicator
              value={metrics.product_metrics.total_products}
              label="Total Products"
              icon={Package}
              color="blue"
            />
            <TrendIndicator
              value={metrics.product_metrics.products_sold_today}
              label="Products Sold Today"
              icon={TrendingUp}
              color="green"
            />
            <TrendIndicator
              value={metrics.product_metrics.low_stock_alerts}
              label="Low Stock Alerts"
              icon={AlertTriangle}
              color="yellow"
            />
            <TrendIndicator
              value={metrics.product_metrics.out_of_stock}
              label="Out of Stock"
              icon={XCircle}
              color="red"
            />
          </div>
        </CardContent>
      </Card>

      {/* Financial Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Financial Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <TrendIndicator
              value={metrics.financial_metrics.outstanding_invoices}
              label="Outstanding Invoices"
              icon={Clock}
              color="yellow"
            />
            <TrendIndicator
              value={metrics.financial_metrics.overdue_invoices}
              label="Overdue Invoices"
              icon={AlertTriangle}
              color="red"
            />
            <TrendIndicator
              value={`$${metrics.financial_metrics.total_receivables.toFixed(2)}`}
              label="Total Receivables"
              icon={DollarSign}
              color="blue"
            />
            <TrendIndicator
              value={`${metrics.financial_metrics.collection_rate}%`}
              label="Collection Rate"
              icon={CheckCircle}
              color="green"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Customer Analytics Component
const CustomerAnalyticsTab = () => {
  const [customerAnalytics, setCustomerAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomerAnalytics();
  }, []);

  const fetchCustomerAnalytics = async () => {
    try {
      const data = await apiCall('/analytics/customers');
      setCustomerAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch customer analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customerAnalytics.filter(customer =>
    customer.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  const getPaymentBehaviorColor = (behavior) => {
    switch (behavior) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'average': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading customer analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Customer Analytics</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline">
            Export Data
          </Button>
        </div>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Avg Order Value</TableHead>
                <TableHead>Lifetime Value</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Payment Behavior</TableHead>
                <TableHead>Growth Trend</TableHead>
                <TableHead>Preferred Products</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.customer_id}>
                  <TableCell className="font-medium">{customer.company_name}</TableCell>
                  <TableCell>{customer.total_orders}</TableCell>
                  <TableCell>${customer.total_revenue.toFixed(2)}</TableCell>
                  <TableCell>${customer.average_order_value.toFixed(2)}</TableCell>
                  <TableCell>${customer.lifetime_value.toFixed(2)}</TableCell>
                  <TableCell>{new Date(customer.last_order_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getPaymentBehaviorColor(customer.payment_behavior)}>
                      {customer.payment_behavior.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(customer.growth_trend)}
                      <span className="text-sm">{customer.growth_trend}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {customer.preferred_products.slice(0, 2).map((product, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {product}
                        </Badge>
                      ))}
                      {customer.preferred_products.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{customer.preferred_products.length - 2}
                        </Badge>
                      )}
                    </div>
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

// Product Analytics Component
const ProductAnalyticsTab = () => {
  const [productAnalytics, setProductAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProductAnalytics();
  }, []);

  const fetchProductAnalytics = async () => {
    try {
      const data = await apiCall('/analytics/products');
      setProductAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch product analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = productAnalytics.filter(product =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  const getSeasonalityColor = (seasonality) => {
    switch (seasonality) {
      case 'summer_peak': return 'bg-yellow-100 text-yellow-800';
      case 'winter_peak': return 'bg-blue-100 text-blue-800';
      case 'consistent': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading product analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Product Performance Analytics</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline">
            Export Data
          </Button>
        </div>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Units Sold (Today)</TableHead>
                <TableHead>Units Sold (Month)</TableHead>
                <TableHead>Units Sold (Year)</TableHead>
                <TableHead>Revenue (Month)</TableHead>
                <TableHead>Revenue (Year)</TableHead>
                <TableHead>Profit Margin</TableHead>
                <TableHead>Inventory Turnover</TableHead>
                <TableHead>Demand Trend</TableHead>
                <TableHead>Seasonality</TableHead>
                <TableHead>Customer Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.product_id}>
                  <TableCell className="font-medium">{product.product_name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.units_sold_today}</TableCell>
                  <TableCell>{product.units_sold_this_month}</TableCell>
                  <TableCell>{product.units_sold_this_year}</TableCell>
                  <TableCell>${product.revenue_this_month.toFixed(2)}</TableCell>
                  <TableCell>${product.revenue_this_year.toFixed(2)}</TableCell>
                  <TableCell>{product.profit_margin.toFixed(1)}%</TableCell>
                  <TableCell>{product.inventory_turnover.toFixed(1)}x</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(product.demand_trend)}
                      <span className="text-sm">{product.demand_trend}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeasonalityColor(product.seasonality)}>
                      {product.seasonality.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>{product.customer_rating}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
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

// Sales Rep Performance Component
const SalesRepPerformanceTab = () => {
  const [salesRepData, setSalesRepData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesRepPerformance();
  }, []);

  const fetchSalesRepPerformance = async () => {
    try {
      const data = await apiCall('/analytics/sales-rep-performance');
      setSalesRepData(data);
    } catch (error) {
      console.error('Failed to fetch sales rep performance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAchievementColor = (rate) => {
    if (rate >= 100) return 'bg-green-100 text-green-800';
    if (rate >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getRankingColor = (ranking) => {
    switch (ranking) {
      case 1: return 'bg-yellow-100 text-yellow-800'; // Gold
      case 2: return 'bg-gray-100 text-gray-800'; // Silver
      case 3: return 'bg-orange-100 text-orange-800'; // Bronze
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading sales rep performance...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Sales Representative Performance</h3>
        <Button variant="outline">
          Export Performance Report
        </Button>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ranking</TableHead>
                <TableHead>Sales Rep</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Orders (Month)</TableHead>
                <TableHead>Revenue (Month)</TableHead>
                <TableHead>Target (Month)</TableHead>
                <TableHead>Achievement Rate</TableHead>
                <TableHead>Avg Deal Size</TableHead>
                <TableHead>Conversion Rate</TableHead>
                <TableHead>Customer Satisfaction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesRepData.map((rep) => (
                <TableRow key={rep.rep_id}>
                  <TableCell>
                    <Badge className={getRankingColor(rep.ranking)}>
                      #{rep.ranking}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{rep.rep_name}</TableCell>
                  <TableCell>{rep.department}</TableCell>
                  <TableCell>{rep.orders_this_month}</TableCell>
                  <TableCell>${rep.revenue_this_month.toFixed(2)}</TableCell>
                  <TableCell>${rep.target_this_month.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getAchievementColor(rep.achievement_rate)}>
                      {rep.achievement_rate.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell>${rep.average_deal_size.toFixed(2)}</TableCell>
                  <TableCell>{rep.conversion_rate.toFixed(1)}%</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>{rep.customer_satisfaction}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
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

// Main Analytics Component
export const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Analytics & Reporting</h2>
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Business Metrics
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Customer Analytics
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Product Analytics
          </TabsTrigger>
          <TabsTrigger value="sales-reps" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Sales Rep Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <BusinessMetricsTab />
        </TabsContent>

        <TabsContent value="customers">
          <CustomerAnalyticsTab />
        </TabsContent>

        <TabsContent value="products">
          <ProductAnalyticsTab />
        </TabsContent>

        <TabsContent value="sales-reps">
          <SalesRepPerformanceTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
