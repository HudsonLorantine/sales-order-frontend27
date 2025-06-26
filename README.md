# Sales Order Management System - Frontend

A modern React-based frontend for managing sales orders, customers, and products.

## 🚀 Live Deployment

- **Production**: https://brave-coast-082fed100.2.azurestaticapps.net
- **Preview**: https://brave-coast-082fed100-preview.eastasia.2.azurestaticapps.net

## 🛠️ Technology Stack

- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.3.5
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS 4.1.7
- **Routing**: React Router DOM 7.6.1
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts 2.15.3
- **Icons**: Lucide React 0.510.0

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   └── ui/              # shadcn/ui components
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── App.jsx              # Main application component
└── main.jsx             # Application entry point
```

## 💻 Local Development

### Prerequisites
- Node.js 18 or higher
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/sales-order-frontend-new.git
cd sales-order-frontend-new

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### API Configuration
The frontend connects to the backend API through a proxy configuration in `staticwebapp.config.json`:

```json
{
  "routes": [
    {
      "route": "/api/*",
      "rewrite": "https://sales-backend-new-7821.azurewebsites.net/api/*"
    }
  ]
}
```

### Environment Variables
For local development, you can override the API base URL in `vite.config.js`:

```javascript
server: {
  proxy: {
    '/api': 'http://localhost:5000',
  },
}
```

## 🚀 Deployment

### Automatic Deployment
This repository is configured with GitHub Actions for automatic deployment to Azure Static Web Apps.

**Deployment triggers:**
- Push to `main` or `master` branch
- Pull requests to `main` or `master` branch

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy using Azure Static Web Apps CLI
npx @azure/static-web-apps-cli deploy ./dist --deployment-token YOUR_DEPLOYMENT_TOKEN
```

## 🔐 Secrets Configuration

For automated deployment, configure these secrets in your GitHub repository:

1. Go to Repository Settings → Secrets and variables → Actions
2. Add new repository secret:
   - `AZURE_STATIC_WEB_APPS_API_TOKEN`: `d32d3594f4f93839fb150f9928f5309086721332e59d5465bac69fc6cfd1753102-446b3474-3134-4cc5-8d7f-e47967e7fb6e0001605082fed100`

## 📱 Features

### Dashboard
- Order statistics and analytics
- Recent orders overview
- Revenue tracking

### Order Management
- Create new orders with multiple line items
- Order status tracking (Unissued → Issued → Complete)
- Payment status tracking
- Order fulfillment management

### Customer Management
- Customer CRUD operations
- Company and contact information
- Billing address management

### Product Management
- Product catalog management
- SKU and pricing information
- Inventory tracking

## 🔗 Related Repositories

- **Backend API**: [sales-order-backend-new](https://github.com/your-username/sales-order-backend-new)

## 🐛 Troubleshooting

### API Connection Issues
1. Verify the backend is running at the configured URL
2. Check CORS settings in the backend
3. Ensure the API proxy configuration is correct

### Build Issues
1. Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
2. Clear Vite cache: `npx vite --clearCache`

## 📄 License

This project is proprietary software for sales order management.
