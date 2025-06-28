# Azure Deployment Guide - Sales Order Management System v1.2

## Overview
This document outlines the complete deployment process for the Sales Order Management System version 1.2 to Microsoft Azure. This system consists of a Flask backend API and a React frontend application.

## Version Information
- **Backend Version**: 1.2.0 (Enhanced with financial, inventory, and analytics modules)
- **Frontend Version**: 1.2.0 (Advanced React components with integration capabilities)
- **Deployment Date**: December 28, 2024
- **Previous Version**: v1.1 (successfully deployed and operational)

## System Architecture

### Backend (Flask API)
- **Framework**: Flask with SQLAlchemy
- **Database**: SQLite (with future PostgreSQL migration path)
- **Key Features**: 
  - Customer management
  - Product catalog
  - Order processing
  - Financial management (invoices, credit notes, tax configuration)
  - Inventory management (warehouses, stock tracking, purchase orders)
  - Analytics and reporting
  - RESTful API endpoints
  - CORS enabled for frontend integration

### Frontend (React Application)
- **Framework**: React 18 with Vite
- **UI Library**: Tailwind CSS with Radix UI components
- **Routing**: React Router DOM
- **Key Features**:
  - Modern responsive design
  - Advanced order management interface
  - Financial management dashboard
  - Inventory tracking interface
  - Analytics and reporting views
  - Integration testing capability

## Deployment Architecture

### Backend Deployment
- **Service**: Azure App Service (Web App)
- **Runtime**: Python 3.11
- **Resource Group**: sales-order-rg-v1-2
- **App Service Plan**: Free tier (F1)
- **App Name**: sales-order-backend-v1-2

### Frontend Deployment
- **Service**: Azure Static Web Apps
- **Build Tool**: Vite
- **Resource Group**: sales-order-rg-v1-2
- **App Name**: sales-order-frontend-v1-2

## Prerequisites

### Required Tools
1. **Azure CLI** (version 2.40+)
   ```bash
   az --version
   ```

2. **PowerShell** (for Windows deployment scripts)

3. **Node.js** (version 18+) for frontend builds
   ```bash
   node --version
   npm --version
   ```

4. **Python** (version 3.11+) for backend
   ```bash
   python --version
   ```

### Azure Account Setup
1. Active Azure subscription
2. Sufficient permissions to create:
   - Resource Groups
   - App Services
   - Static Web Apps
   - Storage Accounts (if needed)

## Directory Structure

```
C:\MY AI PROJECTS\
├── Back-End\
│   ├── sales-order-backend\          # Original v1.1
│   └── sales-order-backend-v1.2\     # New v1.2 deployment
│       ├── src\                      # Main application code
│       ├── api\                      # API route modules
│       ├── requirements.txt          # Python dependencies
│       ├── app_v1_1.py              # Main Flask application
│       └── azure_app.py             # Azure-optimized app entry
└── Project 1\
    ├── sales-order-frontend\         # Original v1.1
    └── sales-order-frontend-v1.2\    # New v1.2 deployment
        ├── src\                      # React source code
        ├── public\                   # Static assets
        ├── package.json              # Node dependencies
        └── vite.config.js           # Build configuration
```

## Deployment Process

### Phase 1: Backend Deployment

#### Step 1: Login to Azure
```powershell
az login
```

#### Step 2: Create Resource Group
```powershell
az group create --name sales-order-rg-v1-2 --location "East US"
```

#### Step 3: Create App Service Plan
```powershell
az appservice plan create --name sales-order-plan-v1-2 --resource-group sales-order-rg-v1-2 --sku F1 --is-linux
```

#### Step 4: Create Web App
```powershell
az webapp create --resource-group sales-order-rg-v1-2 --plan sales-order-plan-v1-2 --name sales-order-backend-v1-2 --runtime "PYTHON|3.11" --deployment-local-git
```

#### Step 5: Configure App Settings
```powershell
az webapp config appsettings set --resource-group sales-order-rg-v1-2 --name sales-order-backend-v1-2 --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

#### Step 6: Deploy Backend Code
Navigate to backend directory and deploy:
```powershell
cd "C:\MY AI PROJECTS\Back-End\sales-order-backend-v1.2"
git init
git add .
git commit -m "Initial v1.2 deployment"
git remote add azure https://sales-order-backend-v1-2@sales-order-backend-v1-2.scm.azurewebsites.net/sales-order-backend-v1-2.git
git push azure main
```

### Phase 2: Frontend Deployment

#### Step 1: Build Frontend
```powershell
cd "C:\MY AI PROJECTS\Project 1\sales-order-frontend-v1.2"
npm install
npm run build
```

#### Step 2: Create Static Web App
```powershell
az staticwebapp create --name sales-order-frontend-v1-2 --resource-group sales-order-rg-v1-2 --source https://github.com/[your-repo] --location "East US2" --branch main --app-location "/" --api-location "api" --output-location "dist"
```

*Note: Replace [your-repo] with your actual GitHub repository URL*

#### Step 3: Manual Upload (Alternative)
If not using GitHub integration:
1. Navigate to Azure Portal
2. Find the Static Web App resource
3. Use the "Browse" option to upload the `dist` folder contents

## Configuration Files

### Backend: requirements.txt
```
Flask==3.0.0
Flask-SQLAlchemy==3.1.1
Flask-CORS==4.0.0
python-dotenv==1.0.0
```

### Frontend: staticwebapp.config.json
```json
{
  "routes": [
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "mimeTypes": {
    ".js": "text/javascript",
    ".css": "text/css"
  }
}
```

### Backend: startup command
```
python app_v1_1.py
```

## Environment Variables and Configuration

### Backend Environment Variables
- `FLASK_ENV`: production
- `DATABASE_URL`: (will be set for production database)
- `SECRET_KEY`: (generated secure key)
- `CORS_ORIGINS`: https://sales-order-frontend-v1-2.azurestaticapps.net

### Frontend Environment Variables
- `VITE_API_BASE_URL`: https://sales-order-backend-v1-2.azurewebsites.net

## Post-Deployment Verification

### Backend Health Check
1. **Base URL Test**:
   ```
   GET https://sales-order-backend-v1-2.azurewebsites.net/
   Expected: "Sales Order Backend API v1.1 is running!"
   ```

2. **API Endpoints Test**:
   ```
   GET https://sales-order-backend-v1-2.azurewebsites.net/api/customers
   GET https://sales-order-backend-v1-2.azurewebsites.net/api/products
   GET https://sales-order-backend-v1-2.azurewebsites.net/api/orders
   ```

3. **New v1.2 Endpoints**:
   ```
   GET https://sales-order-backend-v1-2.azurewebsites.net/api/financial/invoices
   GET https://sales-order-backend-v1-2.azurewebsites.net/api/inventory/warehouses
   GET https://sales-order-backend-v1-2.azurewebsites.net/api/analytics/metrics
   ```

### Frontend Health Check
1. **Access Application**:
   ```
   https://sales-order-frontend-v1-2.azurestaticapps.net
   ```

2. **Verify Pages**:
   - Login page loads correctly
   - Dashboard is accessible
   - All navigation links work
   - Integration test page functions

3. **API Integration Test**:
   - Use built-in integration test page
   - Verify API calls to backend succeed
   - Check CORS configuration

## Monitoring and Logging

### Backend Monitoring
- **Application Logs**: Available in Azure Portal under App Service > Monitoring > Log stream
- **Metrics**: CPU usage, Memory usage, Response times
- **Application Insights**: Can be enabled for detailed monitoring

### Frontend Monitoring
- **Static Web App Analytics**: Built-in analytics for page views and performance
- **Custom Events**: Can be tracked through Application Insights integration

## Troubleshooting Common Issues

### Backend Issues

1. **Import Errors**:
   - Ensure all Python dependencies are in requirements.txt
   - Check Python version compatibility
   - Verify file paths and module structure

2. **Database Connection**:
   - SQLite should work out of the box
   - For production, consider migrating to Azure SQL Database

3. **CORS Issues**:
   - Verify CORS origins are correctly configured
   - Check that frontend domain is whitelisted

### Frontend Issues

1. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

2. **Routing Issues**:
   - Ensure staticwebapp.config.json is properly configured
   - Verify all routes fall back to index.html

3. **API Connection**:
   - Check environment variables are set correctly
   - Verify backend URL is accessible
   - Test CORS configuration

## Version Comparison

### Changes from v1.1 to v1.2

#### Backend Enhancements
- **Financial Management Module**:
  - Invoice management
  - Credit note processing
  - Tax configuration
  - Aging reports

- **Inventory Management Module**:
  - Warehouse management
  - Stock item tracking
  - Stock movement logging
  - Purchase order management

- **Analytics Module**:
  - Business metrics tracking
  - Customer analytics
  - Product performance analytics
  - Sales representative performance
  - Report templates and scheduling
  - Sales forecasting

#### Frontend Enhancements
- **Advanced UI Components**: Enhanced with more sophisticated interfaces
- **Integration Testing**: Built-in capability to test API endpoints
- **Analytics Dashboard**: Comprehensive reporting interface
- **Financial Management Interface**: User-friendly financial operations
- **Inventory Tracking Interface**: Real-time inventory management

## Rollback Strategy

If issues arise with v1.2 deployment:

1. **Backend Rollback**:
   ```powershell
   # Redeploy v1.1 code
   cd "C:\MY AI PROJECTS\Back-End\sales-order-backend"
   git push azure main --force
   ```

2. **Frontend Rollback**:
   - Redeploy v1.1 frontend build
   - Update DNS/routing if necessary

3. **Database Considerations**:
   - Backup current database before v1.2 deployment
   - Have migration scripts ready for rollback

## Security Considerations

### Backend Security
- Environment variables for sensitive data
- CORS properly configured
- Input validation on all endpoints
- SQL injection prevention through SQLAlchemy

### Frontend Security
- No sensitive data in client-side code
- HTTPS enforced for all communication
- Content Security Policy configured

## Performance Optimization

### Backend Optimization
- Database query optimization
- Caching strategies for frequently accessed data
- Connection pooling for database connections

### Frontend Optimization
- Code splitting and lazy loading
- Image optimization
- CDN integration for static assets

## Future Enhancements

### Planned Improvements
1. **Database Migration**: Move from SQLite to Azure SQL Database
2. **Authentication**: Implement Azure AD integration
3. **Caching**: Add Redis cache for improved performance
4. **Monitoring**: Enhanced monitoring with Application Insights
5. **CI/CD**: Automated deployment pipeline setup

## Support and Maintenance

### Regular Maintenance Tasks
1. **Dependency Updates**: Monthly review and update of dependencies
2. **Security Patches**: Apply security updates as available
3. **Performance Monitoring**: Weekly review of application performance
4. **Backup Verification**: Ensure database backups are functioning

### Support Contacts
- **Azure Support**: Through Azure Portal
- **Application Support**: Internal development team
- **Documentation**: This guide and Azure documentation

## Conclusion

This deployment guide provides a comprehensive framework for deploying the Sales Order Management System v1.2 to Azure. The system is designed to be scalable, maintainable, and secure, with clear upgrade paths for future enhancements.

The v1.2 deployment builds upon the successful v1.1 implementation, adding significant functionality while maintaining compatibility and reliability.

---

**Document Version**: 1.0  
**Last Updated**: December 28, 2024  
**Next Review**: January 28, 2025
