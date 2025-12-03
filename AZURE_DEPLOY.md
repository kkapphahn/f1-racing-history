# Azure Deployment Guide

## Quick Deploy to Azure Static Web Apps

### Option 1: Deploy via Azure Portal (Recommended for First Time)

#### Step 1: Create Azure Static Web App

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **"Create a resource"**
3. Search for **"Static Web App"** and select it
4. Click **"Create"**

#### Step 2: Configure Basic Settings

- **Subscription**: Select your Azure subscription
- **Resource Group**: Create new or select existing
- **Name**: `f1-racing-history` (or your preferred name)
- **Plan type**: Free (or Standard for production)
- **Region**: Choose closest to your users

#### Step 3: Configure Deployment

- **Source**: GitHub
- **Sign in** to GitHub if prompted
- **Organization**: Select your GitHub account
- **Repository**: `f1-racing-history`
- **Branch**: `master`

#### Step 4: Build Configuration

- **Build Presets**: Custom
- **App location**: `/`
- **Api location**: `api`
- **Output location**: (leave empty)

#### Step 5: Review and Create

1. Click **"Review + create"**
2. Click **"Create"**
3. Wait for deployment to complete (2-3 minutes)

#### Step 6: Configure Environment Variables

1. Go to your Static Web App in Azure Portal
2. Click **"Configuration"** in the left menu
3. Click **"+ Add"** to add application settings:

   | Name | Value |
   |------|-------|
   | `DATABRICKS_HOST` | Your Databricks workspace URL (e.g., `https://adb-xxxxx.xx.azuredatabricks.net`) |
   | `DATABRICKS_TOKEN` | Your Databricks Personal Access Token |
   | `GENIE_SPACE_ID` | Your Genie Space ID from Databricks |

   **Note**: Use the actual values from your `api/local.settings.json` file.

4. Click **"Save"**

#### Step 7: Wait for Deployment

- GitHub Actions will automatically build and deploy your app
- Check the **Actions** tab in your GitHub repository
- Wait for the green checkmark (usually 3-5 minutes)

#### Step 8: Access Your Site

1. Go back to Azure Portal → Your Static Web App
2. Click **"Browse"** or copy the URL
3. Your site will be at: `https://[your-app-name].azurestaticapps.net`

---

### Option 2: Deploy via Azure CLI

If you have Azure CLI installed:

```powershell
# Login to Azure
az login

# Create resource group (if needed)
az group create --name f1-racing-rg --location eastus2

# Create Static Web App
az staticwebapp create `
  --name f1-racing-history `
  --resource-group f1-racing-rg `
  --source https://github.com/kkapphahn/f1-racing-history `
  --location eastus2 `
  --branch master `
  --app-location "/" `
  --api-location "api" `
  --output-location "" `
  --login-with-github

# Set environment variables (replace with your actual values)
az staticwebapp appsettings set `
  --name f1-racing-history `
  --setting-names `
    DATABRICKS_HOST="your-databricks-workspace-url" `
    DATABRICKS_TOKEN="your-databricks-token" `
    GENIE_SPACE_ID="your-genie-space-id"
```

---

### Option 3: Manual Deploy via VS Code

1. Install **Azure Static Web Apps** extension in VS Code
2. Sign in to Azure
3. Right-click on your workspace folder
4. Select **"Create Static Web App..."**
5. Follow the prompts (same configuration as Option 1)

---

## Post-Deployment Steps

### 1. Verify Deployment

Visit your site and check:
- ✅ Main page loads correctly
- ✅ Navigation works
- ✅ Chat section appears
- ✅ Sample questions are visible

### 2. Test Chat Functionality

1. Click on a sample question
2. Verify the chat initializes
3. Check that responses appear
4. Test data tables and charts

### 3. Monitor Logs

In Azure Portal:
- Go to your Static Web App
- Click **"Application Insights"** (if enabled)
- Or check **"Log stream"** for real-time logs

---

## Troubleshooting

### Issue: Chat not initializing

**Solution**: Check environment variables are set correctly in Azure Portal Configuration

### Issue: 404 on API calls

**Solution**: Verify `staticwebapp.config.json` is in root directory with correct routes

### Issue: Functions not loading

**Solution**: 
1. Check GitHub Actions build log
2. Verify `api/src/functions/index.js` exists
3. Ensure `api/package.json` has correct main entry point

### Issue: CORS errors

**Solution**: This should not happen with Static Web Apps, but if it does:
- Verify API is in `/api` directory
- Check `staticwebapp.config.json` routes configuration

---

## Custom Domain (Optional)

To use your own domain:

1. Go to Azure Portal → Your Static Web App
2. Click **"Custom domains"**
3. Click **"+ Add"**
4. Choose **"Custom domain on other DNS"**
5. Enter your domain name
6. Follow DNS configuration instructions
7. Wait for validation (can take up to 48 hours)

---

## GitHub Actions Workflow

The deployment is automated via GitHub Actions (`.github/workflows/azure-static-web-apps.yml`):

- **Trigger**: Automatic on push to `master` branch
- **Build**: Packages your app and API
- **Deploy**: Publishes to Azure Static Web Apps
- **Status**: Check the Actions tab in your GitHub repo

---

## Cost Estimate

**Free Tier Includes:**
- 100 GB bandwidth per month
- 0.5 GB storage
- Custom domains
- Managed functions (API)
- SSL certificates

**Note**: Databricks charges are separate based on query execution.

---

## Security Best Practices

### Before Going to Production:

1. **Rotate Databricks Token**:
   - Generate a new token with limited permissions
   - Update in Azure Portal Configuration

2. **Enable Authentication** (if needed):
   - Configure Azure AD, GitHub, or other providers
   - Restrict chat access to authenticated users

3. **Add Rate Limiting**:
   - Implement in Azure Functions
   - Prevent excessive Databricks usage

4. **Monitor Costs**:
   - Set up Azure cost alerts
   - Monitor Databricks usage

---

## Next Steps After Deployment

1. ✅ Share your live URL!
2. ✅ Test all chat features
3. ✅ Add more sample questions if needed
4. ✅ Monitor usage and performance
5. ✅ Consider adding user analytics

---

## Need Help?

- **Azure Static Web Apps Docs**: https://docs.microsoft.com/azure/static-web-apps/
- **Databricks Genie Docs**: Check Databricks documentation
- **GitHub Issues**: Create an issue in your repo for tracking

---

**Your app is ready to deploy! 🚀**
