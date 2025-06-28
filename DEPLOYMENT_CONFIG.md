# Sales Order Management System v1.2 - Deployment Configuration

## 🌐 Live URLs

### Production Endpoints
- **Frontend (v1.2)**: https://gentle-sea-04a90970f.2.azurestaticapps.net
- **Backend (v1.2)**: https://sales-order-backend-v1-2.azurewebsites.net

### Legacy Endpoints  
- **Frontend (v1.1)**: https://red-smoke-0b599251e.1.azurestaticapps.net
- **Backend (v1.1)**: https://sales-order-backend.azurewebsites.net

## 🔧 Configuration Settings

### Frontend Environment
```javascript
// src/App.jsx - Line 46
const API_BASE_URL = '/api';  // Uses proxy to backend
```

### Backend CORS Configuration
```javascript
// app.py - Lines 7-12
CORS(app, origins=[
  'http://localhost:5173',  // Local development
  'https://gentle-sea-04a90970f.2.azurestaticapps.net',  // Production frontend v1.2
  'https://red-smoke-0b599251e.1.azurestaticapps.net',  // v1.1 frontend
  'https://brave-coast-082fed100.2.azurestaticapps.net'  // Old frontend
])
```

### Static Web App Proxy Configuration
```json
// staticwebapp.config.json - Lines 4-6
{
  "route": "/api/*",
  "rewrite": "https://sales-order-backend-v1-2.azurewebsites.net/api/{path}",
  "allowedRoles": ["anonymous"]
}
```

## 📊 API Endpoints

### Customer Management
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create new customer  
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Product Management
- `GET /api/products` - List all products
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Order Management
- `GET /api/orders` - List all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get single order
- `POST /api/orders/{id}/issue` - Issue order
- `POST /api/orders/{id}/complete` - Complete order  
- `POST /api/orders/{id}/void` - Void order

### Payment Management
- `GET /api/orders/{id}/payments` - Get order payments
- `POST /api/orders/{id}/payments` - Record payment

## 🚀 Deployment Process

### Frontend Deployment
1. Build the project: `npm run build`
2. Commit changes: `git add . && git commit -m "message"`
3. Push to GitHub: `git push`
4. GitHub Actions automatically deploys to Azure Static Web Apps

### Backend Deployment  
1. Create deployment package: `Compress-Archive -Path "app.py", "sample_data.py", "requirements.txt" -DestinationPath "deployment.zip" -Force`
2. Deploy to Azure: `az webapp deploy --resource-group "My_SalesSystem" --name "sales-order-backend-v1-2" --src-path "deployment.zip" --type zip`
3. Restart webapp: `az webapp restart --resource-group "My_SalesSystem" --name "sales-order-backend-v1-2"`

## 🔍 Testing Endpoints

### Frontend Health Check
```bash
curl https://gentle-sea-04a90970f.2.azurestaticapps.net
```

### Backend Health Check  
```bash
curl https://sales-order-backend-v1-2.azurewebsites.net/api/health
```

### API Test
```bash
curl https://gentle-sea-04a90970f.2.azurestaticapps.net/api/customers
```

## ⚠️ Important Notes

### DO NOT:
- Hardcode localhost URLs in production
- Use direct backend URLs in frontend (use proxy instead)
- Deploy without updating CORS settings
- Forget to restart backend after configuration changes

### ALWAYS:
- Test both frontend and backend after deployment
- Verify API proxy is working correctly
- Check CORS headers in browser dev tools
- Update this document when endpoints change

## 🐛 Troubleshooting

### Common Issues:
1. **503 Service Unavailable**: Backend is starting up, wait 30-60 seconds
2. **CORS Errors**: Check backend CORS configuration includes frontend domain
3. **API Proxy Failing**: Verify staticwebapp.config.json proxy settings
4. **POST/PUT Methods Not Working**: Ensure backend deployment includes all routes

### Testing Commands:
```powershell
# Test backend directly
Invoke-WebRequest -Uri "https://sales-order-backend-v1-2.azurewebsites.net/api/customers" -Method Get

# Test CORS preflight
$headers = @{'Origin' = 'https://gentle-sea-04a90970f.2.azurestaticapps.net'}
Invoke-WebRequest -Uri "https://sales-order-backend-v1-2.azurewebsites.net/api/customers" -Method Options -Headers $headers

# Test POST request
$headers = @{'Content-Type' = 'application/json'}
$body = @{company_name='Test Company'; email='test@test.com'} | ConvertTo-Json
Invoke-WebRequest -Uri "https://sales-order-backend-v1-2.azurewebsites.net/api/customers" -Method Post -Headers $headers -Body $body
```

## 📅 Last Updated
- **Date**: 2025-06-28
- **Version**: 1.2.0
- **Updated By**: AI Assistant
