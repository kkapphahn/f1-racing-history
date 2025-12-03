const { app } = require('@azure/functions');
const fetch = require('node-fetch');

/**
 * Azure Function: Initialize Databricks Genie Conversation
 * 
 * Starts a new conversation with Databricks Genie for F1 data queries.
 * Returns a conversationId that should be used for subsequent messages.
 * 
 * Local Development:
 * 1. Install dependencies: npm install (in /api directory)
 * 2. Update local.settings.json with your Databricks credentials
 * 3. Run: func start (or use Azure Functions extension in VS Code)
 */
app.http('genie-start', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'genie-start',
    handler: async (request, context) => {
        context.log('Starting new Genie conversation');

        const databricksHost = process.env.DATABRICKS_HOST;
        const databricksToken = process.env.DATABRICKS_TOKEN;
        const spaceId = process.env.GENIE_SPACE_ID;

        // Validate environment variables
        if (!databricksHost || !databricksToken || !spaceId) {
            return {
                status: 500,
                jsonBody: { error: 'Server configuration error: Missing Databricks credentials' }
            };
        }

        try {
            const requestBody = await request.json().catch(() => ({}));
            
            // Call Databricks API to start a new conversation
            const response = await fetch(
                `${databricksHost}/api/2.0/genie/spaces/${spaceId}/start-conversation`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${databricksToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        content: requestBody?.initialMessage || 'Hello'
                    })
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                context.error('Databricks API error:', response.status, errorText);
                return {
                    status: response.status,
                    jsonBody: { error: `Failed to start conversation: ${response.statusText}` }
                };
            }

            const data = await response.json();
            
            return {
                status: 200,
                jsonBody: {
                    conversationId: data.conversation_id || data.id,
                    message: 'Conversation started successfully'
                }
            };
        } catch (error) {
            context.error('Error starting conversation:', error);
            return {
                status: 500,
                jsonBody: { error: 'Failed to initialize chat. Please try again.' }
            };
        }
    }
});
