const { app } = require('@azure/functions');
const fetch = require('node-fetch');

/**
 * Azure Function: Send Message to Databricks Genie
 * 
 * Sends a user message to an existing Genie conversation and returns the AI response,
 * including any SQL queries generated and result data.
 * 
 * Request body:
 * {
 *   "conversationId": "string",
 *   "message": "string"
 * }
 * 
 * Response:
 * {
 *   "response": "AI text response",
 *   "query": "Generated SQL query (if applicable)",
 *   "results": [ ... ] // Query results as array of objects
 * }
 */
app.http('genie-message', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'genie-message',
    handler: async (request, context) => {
        context.log('Processing Genie message');

        const requestBody = await request.json().catch(() => ({}));
        const { conversationId, message } = requestBody;

        // Validate request
        if (!conversationId || !message) {
            return {
                status: 400,
                jsonBody: { error: 'Missing required fields: conversationId and message' }
            };
        }

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
            // Send message to Databricks Genie
            const response = await fetch(
                `${databricksHost}/api/2.0/genie/spaces/${spaceId}/conversations/${conversationId}/messages`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${databricksToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        content: message
                    })
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                context.error('Databricks API error:', response.status, errorText);
                
                let errorMessage = 'Failed to process your question. Please try again.';
                if (response.status === 404) {
                    errorMessage = 'Conversation expired. Please refresh the page to start a new chat.';
                } else if (response.status === 429) {
                    errorMessage = 'Too many requests. Please wait a moment and try again.';
                }
                
                return {
                    status: response.status,
                    jsonBody: { error: errorMessage }
                };
            }

            const data = await response.json();
            
            // Extract response, query, and results from Genie's response
            // Note: The exact structure depends on Databricks Genie API response format
            const aiResponse = {
                response: data.content || data.message || 'Response received',
                query: data.query || data.sql || null,
                results: data.result || data.results || data.data || null,
                attachments: data.attachments || null
            };

            return {
                status: 200,
                jsonBody: aiResponse
            };
        } catch (error) {
            context.error('Error processing message:', error);
            return {
                status: 500,
                jsonBody: { error: 'An error occurred while processing your question. Please try again.' }
            };
        }
    }
});
