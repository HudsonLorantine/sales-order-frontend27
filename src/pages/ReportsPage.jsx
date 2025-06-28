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
  FileText, 
  Download, 
  Calendar, 
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Plus, 
  Search, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  AlertTriangle,
  Target,
  Eye
} from 'lucide-react';

// API base URL
const API_BASE_URL = 'http://sales-order-backend-v1-2.azurewebsites.net/api';

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

// Report Templates Component
const ReportTemplatesTab = () => {
  const [reportTemplates, setReportTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReportTemplates();
  }, []);

  const fetchReportTemplates = async () => {
    try {
      const data = await apiCall('/analytics/reports/templates');
      setReportTemplates(data);
    } catch (error) {
      console.error('Failed to fetch report templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = reportTemplates.filter(template =>
    template.template_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.report_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getReportTypeColor = (type) => {
    switch (type) {
      case 'sales': return 'bg-green-100 text-green-800';
      case 'inventory': return 'bg-blue-100 text-blue-800';
      case 'financial': return 'bg-purple-100 text-purple-800';
      case 'customer': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReportTypeIcon = (type) => {
    switch (type) {
      case 'sales': return <TrendingUp className="w-4 h-4" />;
      case 'inventory': return <BarChart3 className="w-4 h-4" />;
      case 'financial': return <DollarSign className="w-4 h-4" />;
      case 'customer': return <Target className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading report templates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Report Templates</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div>
        <Input
          placeholder="Search report templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getReportTypeIcon(template.report_type)}
                  <CardTitle className="text-lg">{template.template_name}</CardTitle>
                </div>
                <Badge className={getReportTypeColor(template.report_type)}>
                  {template.report_type.toUpperCase()}
                </Badge>
              </div>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>Parameters:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {template.parameters.map((param, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {param.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <strong>Output Formats:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {template.output_format.map((format, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {format.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
                <Button size="sm" className="flex-1">
                  <Download className="w-4 h-4 mr-1" />
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Sales Forecasting Component
const SalesForecastingTab = () => {
  const [forecasts, setForecasts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForecasts();
  }, []);

  const fetchForecasts = async () => {
    try {
      const data = await apiCall('/analytics/forecasts');
      setForecasts(data);
    } catch (error) {
      console.error('Failed to fetch sales forecasts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading sales forecasts...</div>;
  }

  if (!forecasts) {
    return <div className="flex justify-center py-8">No forecast data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Sales Forecasting</h3>
          <p className="text-sm text-gray-600">
            Forecast Date: {new Date(forecasts.forecast_date).toLocaleDateString()} | 
            Period: {forecasts.forecast_period.replace('_', ' ').toUpperCase()} | 
            Methodology: {forecasts.methodology.replace(/_/g, ' ').toUpperCase()}
          </p>
        </div>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Update Forecast
        </Button>
      </div>

      {/* Overall Forecast Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Overall Forecast Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                ${forecasts.overall_forecast.predicted_revenue.toFixed(2)}
              </div>
              <div className="text-sm text-blue-800">Predicted Revenue</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {forecasts.overall_forecast.predicted_orders}
              </div>
              <div className="text-sm text-green-800">Predicted Orders</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {forecasts.overall_forecast.growth_rate.toFixed(1)}%
              </div>
              <div className="text-sm text-purple-800">Growth Rate</div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <div className={`text-lg font-semibold ${getConfidenceColor(forecasts.confidence_level)}`}>
              Confidence Level: {forecasts.confidence_level.toFixed(1)}%
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Predicted Revenue</TableHead>
                <TableHead>Predicted Orders</TableHead>
                <TableHead>Confidence Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forecasts.monthly_breakdown.map((month) => (
                <TableRow key={month.month}>
                  <TableCell className="font-medium">
                    {new Date(month.month + '-01').toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </TableCell>
                  <TableCell>${month.predicted_revenue.toFixed(2)}</TableCell>
                  <TableCell>{month.predicted_orders}</TableCell>
                  <TableCell>
                    <span className={getConfidenceColor(month.confidence)}>
                      {month.confidence.toFixed(1)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product Forecasts */}
      <Card>
        <CardHeader>
          <CardTitle>Product Forecasts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Predicted Units</TableHead>
                <TableHead>Predicted Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forecasts.product_forecasts.map((product) => (
                <TableRow key={product.product_id}>
                  <TableCell className="font-medium">{product.product_name}</TableCell>
                  <TableCell>{product.predicted_units}</TableCell>
                  <TableCell>${product.predicted_revenue.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// Custom Reports Component
const CustomReportsTab = () => {
  const [customReports, setCustomReports] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Mock data for custom reports
  useEffect(() => {
    setCustomReports([
      {
        id: 1,
        name: "Q4 Sales Performance",
        type: "sales",
        created_date: "2025-06-15",
        last_run: "2025-06-28",
        status: "completed",
        schedule: "monthly"
      },
      {
        id: 2,
        name: "Inventory Valuation Report",
        type: "inventory",
        created_date: "2025-06-10",
        last_run: "2025-06-27",
        status: "completed",
        schedule: "weekly"
      },
      {
        id: 3,
        name: "Customer Lifetime Value Analysis",
        type: "customer",
        created_date: "2025-06-20",
        last_run: null,
        status: "pending",
        schedule: "on-demand"
      }
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'sales': return 'bg-green-100 text-green-800';
      case 'inventory': return 'bg-blue-100 text-blue-800';
      case 'financial': return 'bg-purple-100 text-purple-800';
      case 'customer': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Custom Reports</h3>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Custom Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Custom Report</DialogTitle>
              <DialogDescription>
                Configure a custom report with your specific requirements
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="report-name">Report Name</Label>
                <Input id="report-name" placeholder="Enter report name" />
              </div>
              <div>
                <Label htmlFor="report-type">Report Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="schedule">Schedule</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on-demand">On Demand</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowCreateDialog(false)}>Create Report</Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(report.type)}>
                      {report.type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(report.created_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {report.last_run ? new Date(report.last_run).toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.schedule.replace('-', ' ').toUpperCase()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
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

// Main Reports Component
export const ReportsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Reports & Forecasting</h2>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Report Templates
          </TabsTrigger>
          <TabsTrigger value="forecasting" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Sales Forecasting
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Custom Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <ReportTemplatesTab />
        </TabsContent>

        <TabsContent value="forecasting">
          <SalesForecastingTab />
        </TabsContent>

        <TabsContent value="custom">
          <CustomReportsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
