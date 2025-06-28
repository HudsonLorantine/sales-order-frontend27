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
  Warehouse, 
  Package, 
  ArrowUpDown, 
  ShoppingCart,
  Plus, 
  Search, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Building2,
  TrendingUp,
  TrendingDown
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

// Status badge component for inventory statuses
const InventoryStatusBadge = ({ status, type = 'stock' }) => {
  const getStatusColor = (status, type) => {
    if (type === 'stock') {
      switch (status) {
        case 'in_stock': return 'bg-green-100 text-green-800';
        case 'low_stock': return 'bg-yellow-100 text-yellow-800';
        case 'out_of_stock': return 'bg-red-100 text-red-800';
        case 'discontinued': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    } else if (type === 'movement') {
      switch (status) {
        case 'stock_in': return 'bg-green-100 text-green-800';
        case 'stock_out': return 'bg-red-100 text-red-800';
        case 'adjustment': return 'bg-blue-100 text-blue-800';
        case 'transfer': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    } else if (type === 'po') {
      switch (status) {
        case 'draft': return 'bg-gray-100 text-gray-800';
        case 'sent': return 'bg-blue-100 text-blue-800';
        case 'received': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
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

// Warehouses Component
const WarehousesTab = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      // Mock warehouses data since endpoint doesn't exist yet
      const mockWarehouses = [
        {
          id: 1,
          warehouse_name: 'Main Warehouse',
          warehouse_code: 'WH-001',
          warehouse_type: 'Distribution',
          manager_name: 'John Manager',
          capacity: 50000,
          address: '123 Industrial Blvd, City, State 12345',
          phone: '555-0101',
          email: 'main@warehouse.com',
          is_active: true
        },
        {
          id: 2,
          warehouse_name: 'Secondary Storage',
          warehouse_code: 'WH-002',
          warehouse_type: 'Storage',
          manager_name: 'Jane Smith',
          capacity: 25000,
          address: '456 Storage Lane, City, State 12345',
          phone: '555-0102',
          email: 'storage@warehouse.com',
          is_active: true
        },
        {
          id: 3,
          warehouse_name: 'Overflow Facility',
          warehouse_code: 'WH-003',
          warehouse_type: 'Overflow',
          manager_name: 'Bob Wilson',
          capacity: 15000,
          address: '789 Overflow St, City, State 12345',
          phone: '555-0103',
          email: 'overflow@warehouse.com',
          is_active: false
        }
      ];
      setWarehouses(mockWarehouses);
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.warehouse_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.warehouse_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center py-8">Loading warehouses...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Warehouses</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Warehouse
        </Button>
      </div>

      <div>
        <Input
          placeholder="Search warehouses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWarehouses.map((warehouse) => (
          <Card key={warehouse.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{warehouse.warehouse_name}</CardTitle>
                  <CardDescription>{warehouse.warehouse_code}</CardDescription>
                </div>
                <Badge variant={warehouse.is_active ? 'default' : 'secondary'}>
                  {warehouse.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Type:</strong> {warehouse.warehouse_type}</div>
              <div><strong>Manager:</strong> {warehouse.manager_name}</div>
              <div><strong>Capacity:</strong> {warehouse.capacity.toLocaleString()} units</div>
              <div><strong>Address:</strong> {warehouse.address}</div>
              <div><strong>Phone:</strong> {warehouse.phone}</div>
              <div><strong>Email:</strong> {warehouse.email}</div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Stock Items Component
const StockItemsTab = () => {
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStockItems();
  }, []);

  const fetchStockItems = async () => {
    try {
      const data = await apiCall('/inventory/stock-items');
      setStockItems(data);
    } catch (error) {
      console.error('Failed to fetch stock items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStockItems = stockItems.filter(item =>
    item.product?.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product?.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (item) => {
    if (item.quantity_on_hand <= 0) return 'out_of_stock';
    if (item.quantity_on_hand <= item.reorder_point) return 'low_stock';
    return 'in_stock';
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading stock items...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Stock Items</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Stock Item
        </Button>
      </div>

      <div>
        <Input
          placeholder="Search stock items..."
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
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>On Hand</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Reserved</TableHead>
                <TableHead>Reorder Point</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.product?.product_name}</TableCell>
                  <TableCell>{item.product?.sku}</TableCell>
                  <TableCell>{item.warehouse?.warehouse_name}</TableCell>
                  <TableCell>{item.quantity_on_hand}</TableCell>
                  <TableCell>{item.quantity_available}</TableCell>
                  <TableCell>{item.quantity_reserved}</TableCell>
                  <TableCell>{item.reorder_point}</TableCell>
                  <TableCell>${item.unit_cost.toFixed(2)}</TableCell>
                  <TableCell>${item.total_value.toFixed(2)}</TableCell>
                  <TableCell>
                    <InventoryStatusBadge status={getStockStatus(item)} type="stock" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        Adjust
                      </Button>
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

// Stock Movements Component
const MovementsTab = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    try {
      const data = await apiCall('/inventory/movements');
      setMovements(data);
    } catch (error) {
      console.error('Failed to fetch stock movements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovements = movements.filter(movement =>
    movement.product?.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movement.reference_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center py-8">Loading stock movements...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Stock Movements</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Record Movement
        </Button>
      </div>

      <div>
        <Input
          placeholder="Search movements..."
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
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Movement Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{new Date(movement.movement_date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{movement.product?.product_name}</TableCell>
                  <TableCell>
                    <InventoryStatusBadge status={movement.movement_type} type="movement" />
                  </TableCell>
                  <TableCell className={movement.quantity >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {movement.quantity >= 0 ? '+' : ''}{movement.quantity}
                  </TableCell>
                  <TableCell>${movement.unit_cost.toFixed(2)}</TableCell>
                  <TableCell>{movement.reference_number}</TableCell>
                  <TableCell>{movement.notes}</TableCell>
                  <TableCell>{movement.created_by}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View
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

// Purchase Orders Component
const PurchaseOrdersTab = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      const data = await apiCall('/inventory/purchase-orders');
      setPurchaseOrders(data);
    } catch (error) {
      console.error('Failed to fetch purchase orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPurchaseOrders = purchaseOrders.filter(po =>
    po.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.supplier?.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center py-8">Loading purchase orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Purchase Orders</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Purchase Order
        </Button>
      </div>

      <div>
        <Input
          placeholder="Search purchase orders..."
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
                <TableHead>PO Number</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Expected Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchaseOrders.map((po) => (
                <TableRow key={po.id}>
                  <TableCell className="font-medium">{po.po_number}</TableCell>
                  <TableCell>{po.supplier?.supplier_name}</TableCell>
                  <TableCell>{new Date(po.order_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(po.expected_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <InventoryStatusBadge status={po.status} type="po" />
                  </TableCell>
                  <TableCell>${po.subtotal.toFixed(2)}</TableCell>
                  <TableCell>${po.tax_amount.toFixed(2)}</TableCell>
                  <TableCell>${po.total_amount.toFixed(2)}</TableCell>
                  <TableCell>{po.currency}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
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

// Main Inventory Management Component
export const InventoryPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Warehouse className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Inventory Management</h2>
      </div>

      <Tabs defaultValue="warehouses" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="warehouses" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Warehouses
          </TabsTrigger>
          <TabsTrigger value="stock-items" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Stock Items
          </TabsTrigger>
          <TabsTrigger value="movements" className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" />
            Movements
          </TabsTrigger>
          <TabsTrigger value="purchase-orders" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Purchase Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="warehouses">
          <WarehousesTab />
        </TabsContent>

        <TabsContent value="stock-items">
          <StockItemsTab />
        </TabsContent>

        <TabsContent value="movements">
          <MovementsTab />
        </TabsContent>

        <TabsContent value="purchase-orders">
          <PurchaseOrdersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryPage;
