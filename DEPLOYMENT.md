# Azure Deployment Checklist

## Pre-Deployment Setup

### 1. Azure App Service Configuration
- [ ] App Service created (Linux or Windows)
- [ ] Runtime: Node 22 LTS
- [ ] Startup Command: `node server.js`
- [ ] Always On: Enabled (for production)

### 2. GitHub Secrets Required
```
CLIENT_ID                   # Azure Service Principal
TENANT_ID                   # Azure Tenant
SUBSCRIPTION_ID             # Azure Subscription
NEXT_PUBLIC_API_BASE_URL    # Backend API endpoint
```

### 3. Azure App Settings (Environment Variables)
```
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://pamten-re-backend-java-dev.azurewebsites.net
WEBSITE_NODE_DEFAULT_VERSION=22-lts
```

**Note about PORT:**
- Azure App Service automatically sets the `PORT` environment variable (typically 8080)
- The standalone Next.js server reads `PORT` from the environment
- You do NOT need to manually configure PORT in App Settings

## Deployment Files

### Required Files in Deployment Package
After building and preparing the deployment package, the following structure is deployed:

**Deployed Structure:**
```
/
├── server.js              - Standalone Next.js server (from nextjs/standalone/)
├── package.json           - Runtime dependencies list
├── node_modules/          - Minimal runtime dependencies (from standalone build)
├── nextjs/                - Next.js build output and metadata
│   ├── server/            - Server-side compiled pages and API routes
│   └── static/            - Static assets (CSS, JS chunks)
├── public/                - Public assets (favicons, robots.txt, images)
└── web.config             - IIS/IISNode configuration (Windows App Service)
```

**Key Points:**
- ✅ `server.js` is the standalone Next.js server (auto-generated during build)
- ✅ The custom root `server.js` is NOT deployed (only used for local Azure testing)
- ✅ `nextjs/` contains build output, NOT the source `nextjs/standalone/` directory
- ✅ `web.config` configures IISNode to run `node server.js`

### Files NOT in Deployment
- ❌ `src/` - Source files (not needed, only built output)
- ❌ `.env*` - Use Azure App Settings for environment variables
- ❌ `.git/` - Version control files
- ❌ Custom root `server.js` - Only for local testing, standalone version is used

## GitHub Actions Workflow

### Trigger Branches
- `develop` → Dev environment
- `feature/**` → Dev environment
- `master` → Production environment

### Workflow Steps
1. Checkout code
2. Setup Node.js 22
3. Install dependencies (`npm ci`)
4. Build Next.js app (`npm run build`)
5. Prepare deployment package (copy standalone bundle + static assets)
6. Verify `server.js` and `nextjs/static` exist
7. Deploy to Azure Web App
8. Upload build artifact
9. Verify site availability

## Troubleshooting

### Issue: `nextjs` folder missing after deployment

**Symptoms:**
- Application shows "500 Internal Server Error"
- Azure logs show "Cannot find module 'nextjs/...'
- Build artifact doesn't contain `nextjs/` folder in extracted site

**Solutions:**
1. Check GitHub Actions logs for build errors
2. Verify `npm run build` completes successfully
-3. Ensure `cp -r nextjs/standalone/. deploy/` in workflow runs without errors
-4. Check `.gitignore` doesn't prevent `nextjs/` from being created
-5. Verify artifact upload includes `nextjs/static` folder
6. Remember: Azure Zip Deploy skips hidden folders (starting with `.`); the custom dist dir avoids that.

### Issue: Application won't start

**Check:**
1. Azure Portal → Log Stream for error messages
2. Startup command is set to `node server.js`
3. `server.js` exists in deployed files
4. PORT environment variable is available
5. Node version matches (22 LTS)

### Issue: Static files (CSS, JS, images) not loading

**Solutions:**
1. Verify `public/` folder is in deployment package
2. Check `web.config` allows static file serving (Windows)
3. Ensure `nextjs/static/` folder exists with built assets
4. Check browser console for 404 errors

### Issue: API calls returning 404 or CORS errors

**Solutions:**
1. Set `NEXT_PUBLIC_API_BASE_URL` in Azure App Settings
2. Verify backend is accessible from Azure
3. Check CORS configuration on backend
4. Test API endpoint directly from Azure environment

## Verification Steps

After deployment:
1. ✅ Visit app URL: `https://pamten-re-frontend-react-dev.azurewebsites.net`
2. ✅ Check browser console for errors
3. ✅ Verify static assets load (check Network tab)
4. ✅ Test authentication flow
5. ✅ Check Azure Log Stream for server errors
6. ✅ Test API integration

## Performance Optimization

- Enable Application Insights for monitoring
- Configure CDN for static assets
- Use Azure Front Door for global distribution
- Enable compression in web.config
- Set appropriate Cache-Control headers

## Rollback Strategy

If deployment fails:
1. Use Azure Portal → Deployment Center → Deployment History
2. Revert to previous successful deployment
3. Or redeploy previous commit via GitHub Actions

## Useful Azure CLI Commands

```bash
# View logs
az webapp log tail --name <app-name> --resource-group <rg-name>

# Restart app
az webapp restart --name <app-name> --resource-group <rg-name>

# List environment variables
az webapp config appsettings list --name <app-name> --resource-group <rg-name>

# Set environment variable
az webapp config appsettings set --name <app-name> --resource-group <rg-name> --settings KEY=VALUE
```
