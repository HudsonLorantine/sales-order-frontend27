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
  Receipt, 
  CreditCard, 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  AlertTriangle,
  Calculator
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

// Status badge component for financial statuses
const FinancialStatusBadge = ({ status, type = 'invoice' }) => {
  const getStatusColor = (status, type) => {
    if (type === 'invoice') {
      switch (status) {
        case 'draft': return 'bg-gray-100 text-gray-800';
        case 'sent': return 'bg-blue-100 text-blue-800';
        case 'paid': return 'bg-green-100 text-green-800';
        case 'overdue': return 'bg-red-100 text-red-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    } else if (type === 'credit') {
      switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'approved': return 'bg-green-100 text-green-800';
        case 'rejected': return 'bg-red-100 text-red-800';
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

// Invoices Component
const InvoicesTab = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      // Generate mock invoices from orders data since /financial/invoices endpoint doesn't exist yet
      const orders = await apiCall('/orders');
      const mockInvoices = orders.map((order, index) => ({
        id: order.id,
        invoice_number: `INV-${new Date(order.order_date).getFullYear()}-${(order.id + 1000).toString().padStart(4, '0')}`,
        customer: order.customer,
        invoice_date: order.order_date,
        due_date: new Date(new Date(order.order_date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: order.payment_status === 'paid' ? 'paid' : order.status === 'complete' ? 'sent' : 'draft',
        total_amount: order.total_amount,
        currency: 'USD',
        order_id: order.id
      }));
      setInvoices(mockInvoices);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      // Fallback to empty array if API fails
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer?.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center py-8">Loading invoices...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Invoices</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      <div>
        <Input
          placeholder="Search invoices..."
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
                <TableHead>Invoice Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                  <TableCell>{invoice.customer?.company_name}</TableCell>
                  <TableCell>{new Date(invoice.invoice_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <FinancialStatusBadge status={invoice.status} type="invoice" />
                  </TableCell>
                  <TableCell>${invoice.total_amount.toFixed(2)}</TableCell>
                  <TableCell>{invoice.currency}</TableCell>
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

// Credit Notes Component
const CreditNotesTab = () => {
  const [creditNotes, setCreditNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCreditNotes();
  }, []);

  const fetchCreditNotes = async () => {
    try {
      // Mock credit notes data since endpoint doesn't exist yet
      const mockCreditNotes = [
        {
          id: 1,
          credit_note_number: 'CN-2025-001',
          customer: { company_name: 'Acme Corporation' },
          reason: 'product_return',
          credit_date: new Date().toISOString(),
          amount: 150.00,
          status: 'approved'
        },
        {
          id: 2,
          credit_note_number: 'CN-2025-002',
          customer: { company_name: 'Beta Industries' },
          reason: 'billing_error',
          credit_date: new Date(Date.now() - 24*60*60*1000).toISOString(),
          amount: 75.50,
          status: 'pending'
        }
      ];
      setCreditNotes(mockCreditNotes);
    } catch (error) {
      console.error('Failed to fetch credit notes:', error);
      setCreditNotes([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading credit notes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Credit Notes</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Credit Note
        </Button>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Credit Note Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Credit Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creditNotes.map((creditNote) => (
                <TableRow key={creditNote.id}>
                  <TableCell className="font-medium">{creditNote.credit_note_number}</TableCell>
                  <TableCell>{creditNote.customer?.company_name}</TableCell>
                  <TableCell>{creditNote.reason.replace('_', ' ')}</TableCell>
                  <TableCell>{new Date(creditNote.credit_date).toLocaleDateString()}</TableCell>
                  <TableCell>${creditNote.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <FinancialStatusBadge status={creditNote.status} type="credit" />
                  </TableCell>
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

// Tax Configuration Component
const TaxConfigTab = () => {
  const [taxConfigs, setTaxConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTaxConfig();
  }, []);

  const fetchTaxConfig = async () => {
    try {
      // Mock tax configuration data since endpoint doesn't exist yet
      const mockTaxConfigs = [
        {
          id: 1,
          tax_code: 'GST',
          tax_name: 'Goods and Services Tax',
          tax_rate: 10.0,
          applies_to: 'All Products',
          is_active: true
        },
        {
          id: 2,
          tax_code: 'VAT',
          tax_name: 'Value Added Tax',
          tax_rate: 20.0,
          applies_to: 'EU Sales',
          is_active: true
        },
        {
          id: 3,
          tax_code: 'EXEMPT',
          tax_name: 'Tax Exempt',
          tax_rate: 0.0,
          applies_to: 'Non-Profit',
          is_active: true
        }
      ];
      setTaxConfigs(mockTaxConfigs);
    } catch (error) {
      console.error('Failed to fetch tax configuration:', error);
      setTaxConfigs([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading tax configuration...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tax Configuration</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Tax Rule
        </Button>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tax Code</TableHead>
                <TableHead>Tax Name</TableHead>
                <TableHead>Tax Rate (%)</TableHead>
                <TableHead>Applies To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxConfigs.map((tax) => (
                <TableRow key={tax.id}>
                  <TableCell className="font-medium">{tax.tax_code}</TableCell>
                  <TableCell>{tax.tax_name}</TableCell>
                  <TableCell>{tax.tax_rate}%</TableCell>
                  <TableCell>{tax.applies_to}</TableCell>
                  <TableCell>
                    <Badge variant={tax.is_active ? 'default' : 'secondary'}>
                      {tax.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        Configure
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

// Aging Report Component
const AgingReportTab = () => {
  const [agingReport, setAgingReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgingReport();
  }, []);

  const fetchAgingReport = async () => {
    try {
      // Mock aging report data since endpoint doesn't exist yet
      const mockAgingReport = {
        report_date: new Date().toISOString(),
        summary: {
          total_outstanding: 15750.50,
          current: 8500.00,
          '30_days': 4200.00,
          '60_days': 2050.50,
          '90_days': 750.00,
          over_90_days: 250.00
        },
        customers: [
          {
            customer_id: 1,
            company_name: 'Acme Corporation',
            total_outstanding: 5200.00,
            current: 3000.00,
            '30_days': 1500.00,
            '60_days': 700.00,
            '90_days': 0.00,
            over_90_days: 0.00
          },
          {
            customer_id: 2,
            company_name: 'Beta Industries',
            total_outstanding: 3500.50,
            current: 2000.00,
            '60_days': 1350.50,
            '30_days': 150.00,
            '90_days': 0.00,
            over_90_days: 0.00
          },
          {
            customer_id: 3,
            company_name: 'Gamma Corp',
            total_outstanding: 7050.00,
            current: 3500.00,
            '30_days': 2550.00,
            '60_days': 0.00,
            '90_days': 750.00,
            over_90_days: 250.00
          }
        ]
      };
      setAgingReport(mockAgingReport);
    } catch (error) {
      console.error('Failed to fetch aging report:', error);
      setAgingReport(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading aging report...</div>;
  }

  if (!agingReport) {
    return <div className="flex justify-center py-8">No aging report data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Accounts Receivable Aging Report</h3>
        <p className="text-sm text-gray-600">Report Date: {new Date(agingReport.report_date).toLocaleDateString()}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${agingReport.summary.total_outstanding.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${agingReport.summary.current.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">30 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">${agingReport.summary['30_days'].toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">60 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${agingReport.summary['60_days'].toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">90 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${agingReport.summary['90_days'].toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">90+ Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">${agingReport.summary.over_90_days.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Total Outstanding</TableHead>
                <TableHead>Current</TableHead>
                <TableHead>30 Days</TableHead>
                <TableHead>60 Days</TableHead>
                <TableHead>90 Days</TableHead>
                <TableHead>90+ Days</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agingReport.customers.map((customer) => (
                <TableRow key={customer.customer_id}>
                  <TableCell className="font-medium">{customer.company_name}</TableCell>
                  <TableCell>${customer.total_outstanding.toFixed(2)}</TableCell>
                  <TableCell className="text-green-600">${customer.current.toFixed(2)}</TableCell>
                  <TableCell className="text-yellow-600">${customer['30_days'].toFixed(2)}</TableCell>
                  <TableCell className="text-orange-600">${customer['60_days'].toFixed(2)}</TableCell>
                  <TableCell className="text-red-600">${customer['90_days'].toFixed(2)}</TableCell>
                  <TableCell className="text-red-800">${customer.over_90_days.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Financial Management Component
export const FinancialPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Financial Management</h2>
      </div>

      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="credit-notes" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Credit Notes
          </TabsTrigger>
          <TabsTrigger value="tax-config" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Tax Config
          </TabsTrigger>
          <TabsTrigger value="aging-report" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Aging Report
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <InvoicesTab />
        </TabsContent>

        <TabsContent value="credit-notes">
          <CreditNotesTab />
        </TabsContent>

        <TabsContent value="tax-config">
          <TaxConfigTab />
        </TabsContent>

        <TabsContent value="aging-report">
          <AgingReportTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialPage;
