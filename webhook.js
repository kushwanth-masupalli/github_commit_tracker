// Example improved error handling and logging in webhook.js

let successCount = 0;
let errorCount = 0;

function handleWebhookEvent(event) {
    try {
        // Process the event
        if (event.type === 'push') {
            // Your existing push handling logic
            successCount++;
            return { status: 200, message: 'Webhook processed successfully.' };
        }
        // You can add other event types here
    } catch (error) {
        errorCount++;
        console.error('Critical error occurred:', error);
        return { status: 500, message: 'Internal Server Error' };
    }
}

// Logging success and error counts
setInterval(() => {
    console.log(`Success Count: ${successCount}, Error Count: ${errorCount}`);
}, 60000); // Log every minute

// Export handleWebhookEvent for use in your application
module.exports = handleWebhookEvent;