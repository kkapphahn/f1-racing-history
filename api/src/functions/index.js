const { app } = require('@azure/functions');
const fetch = require('node-fetch');

/**
 * Azure Function: Initialize Databricks Genie Conversation
 * 
 * Starts a new conversation with Databricks Genie for F1 data queries.
 * Returns a conversationId that should be used for subsequent messages.
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

/**
 * Azure Function: Send Message to Databricks Genie
 * 
 * Sends a user message to an existing Genie conversation and returns the AI response,
 * including any SQL queries generated and result data.
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
