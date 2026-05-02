# Frontend Deployment on Railway

This guide explains how to deploy the frontend of the Team Task Management application on Railway.

## Prerequisites

1. A Railway account (https://railway.app/)
2. GitHub repository with the project code
3. Backend service already deployed at: `https://affectionate-reverence-production-a566.up.railway.app/`

## Files Created for Deployment

The following files have been created for Railway deployment:

- `frontend/Dockerfile` - Docker configuration for building and serving the React app
- `frontend/nginx.conf` - Nginx configuration for serving static files and handling SPA routing
- `frontend/.env.production` - Production environment variables with backend API URL
- `frontend/railway.json` - Railway-specific configuration

## Deployment Steps

### Option 1: Deploy via Railway Dashboard

1. **Create a new project** on Railway
2. **Connect your GitHub repository**
3. **Configure the service**:
   - Set the root directory to `frontend`
   - Railway will automatically detect the `railway.json` configuration
   - The build will use the Dockerfile in the frontend directory

4. **Add environment variables** (optional, already set in .env.production):
   - `VITE_API_URL`: `https://affectionate-reverence-production-a566.up.railway.app/api`
   - This is already configured in `.env.production` and will be used during build

5. **Deploy** the service

### Option 2: Deploy via Railway CLI

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Initialize and deploy:
   ```bash
   cd frontend
   railway init
   railway up
   ```

## Configuration Details

### Backend Connection
The frontend is configured to connect to the backend at:
```
https://affectionate-reverence-production-a566.up.railway.app/api
```

This URL is set in `frontend/.env.production` and used during the build process.

### Docker Build Process
The Dockerfile performs a multi-stage build:
1. **Builder stage**: Installs dependencies and builds the React app using Vite
2. **Production stage**: Uses nginx to serve the built static files

### Nginx Configuration
The nginx configuration:
- Serves files on port 80
- Enables gzip compression for better performance
- Configures caching for static assets
- Handles SPA routing by returning `index.html` for all routes

## Verifying Deployment

After deployment:
1. Visit the Railway-provided URL for your frontend service
2. The application should load correctly
3. Check that API calls are being made to the correct backend URL
4. Test authentication and other features to ensure proper connectivity

## Troubleshooting

### Build Failures
- Check that all required files are present in the frontend directory
- Verify that `package.json` has all necessary dependencies
- Ensure the Dockerfile has correct syntax

### Connection Issues
- Verify the backend URL is correct and accessible
- Check CORS configuration on the backend if experiencing cross-origin errors
- Ensure the backend is running and healthy

### Routing Issues
- If you get 404 errors when refreshing pages, ensure nginx is correctly configured to serve `index.html` for all routes
- Check the nginx configuration file for proper SPA routing setup

## Environment Variables

For local development, create a `.env` file in the frontend directory with:
```
VITE_API_URL=http://localhost:8000/api
```

For production, the `.env.production` file is used with the Railway backend URL.

## Updating Backend URL

If the backend URL changes, update `frontend/.env.production` with the new URL and redeploy.