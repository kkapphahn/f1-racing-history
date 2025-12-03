# F1 Racing History - Databricks Genie Integration

## Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- Azure Functions Core Tools (for testing API locally)
- Databricks workspace with Genie configured

### Installation Steps

1. **Install API dependencies:**
   ```bash
   cd api
   npm install
   ```

2. **Configure local environment:**
   - Copy `local.settings.json` template (already in `/api`)
   - Update the following values:
     - `DATABRICKS_HOST`: Your Databricks workspace URL
     - `DATABRICKS_TOKEN`: Generate from Databricks User Settings > Access Tokens
     - `GENIE_SPACE_ID`: Already set to `01f0c59b03181121881a09d5651cf3be`

3. **Run Azure Functions locally:**
   ```bash
   cd api
   func start
   ```
   This starts the API on `http://localhost:7071`

4. **Serve the website:**
   - Option A: Use VS Code Live Server extension
   - Option B: Use Python: `python -m http.server 8000`
   - Option C: Use Node: `npx serve .`

5. **Update API endpoint for local testing:**
   - In `script.js`, temporarily change API URLs to local:
     ```javascript
     fetch('http://localhost:7071/api/genie-start', ...)
     ```

## Azure Static Web Apps Deployment

### Setup in Azure Portal

1. **Create Azure Static Web App:**
   - Go to Azure Portal > Create Resource > Static Web App
   - Link to your GitHub repository
   - Build preset: Custom
   - App location: `/`
   - Api location: `/api`
   - Output location: (leave empty)

2. **Configure Environment Variables:**
   - In Azure Portal, go to your Static Web App
   - Navigate to Configuration > Application settings
   - Add the following variables:
     - `DATABRICKS_HOST`: Your Databricks workspace URL
     - `DATABRICKS_TOKEN`: Your Databricks PAT (mark as secret)
     - `GENIE_SPACE_ID`: `01f0c59b03181121881a09d5651cf3be`

3. **Deploy:**
   - Push to your GitHub repository
   - GitHub Actions will automatically build and deploy
   - API functions will be automatically deployed as managed functions

### Manual Deployment

If not using GitHub Actions:

1. **Install Azure Static Web Apps CLI:**
   ```bash
   npm install -g @azure/static-web-apps-cli
   ```

2. **Build and deploy:**
   ```bash
   swa deploy --app-location . --api-location api
   ```

## Architecture

```
┌─────────────────┐
│  Frontend HTML  │
│   CSS, Chart.js │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Azure Functions │
│  /api/genie-*   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Databricks    │
│   Genie API     │
└─────────────────┘
```

## API Endpoints

- **POST /api/genie-start**: Initialize new conversation
  - Response: `{ conversationId: string }`

- **POST /api/genie-message**: Send message to Genie
  - Body: `{ conversationId: string, message: string }`
  - Response: `{ response: string, query: string, results: array }`

## Troubleshooting

### CORS Errors
- Ensure API location is set to `/api` in `staticwebapp.config.json`
- Check that functions are running on correct port locally

### Authentication Errors
- Verify Databricks token is valid and has necessary permissions
- Check token hasn't expired (regenerate if needed)

### Genie API Errors
- Confirm Genie Space ID is correct
- Ensure Genie is properly configured in Databricks workspace
- Check Databricks workspace URL format (no trailing slash)

## Features

- **Natural Language Queries**: Ask questions about F1 data in plain English
- **Auto-detected Visualizations**: Charts automatically generated based on data type
- **Paginated Results**: Tables show 20 rows with navigation
- **Mobile Responsive**: Auto-focus and optimized layout for mobile devices
- **F1-Themed Design**: Charts use F1 colors (red, gold) matching site aesthetic
- **Error Handling**: Inline error messages with helpful guidance

## Security Notes

- API tokens are never exposed to client-side code
- All Databricks calls routed through backend proxy
- Rate limiting recommended for production use
- HTTPS enforced via Azure Static Web Apps

## Cost Considerations

- Azure Static Web Apps: Free tier available
- Azure Functions: Consumption plan (pay-per-execution)
- Databricks: Charged per query execution and compute usage
- Consider implementing client-side rate limiting to control costs
