# Trigger N8N Webhook

## 🤖 What does this Actor do?

This Apify Actor triggers N8N webhooks using their URL. It allows you to programmatically send data to N8N and optionally enhance the webhook data with information from previous Actor runs.

## ▶️ Input Configuration

### Required Parameters

- `webhookUrl` (string): Your N8N webhook URL
  - Must be a valid URL starting with `https://hooks.N8N.com/hooks/catch/`
  - You can find this URL in your N8N zap when setting up a webhook trigger

- `data` (object): Data to pass to the N8N webhook
  - Default: `{}`
  - The data object will be sent as the body of the webhook request

### Optional Parameters

- `runId` (string): ID of a previous Actor run to use for data transformation
  - If provided, you must also provide a `transformFunction`

- `transformFunction` (string): JavaScript function to transform the data before sending
  - Required if `runId` is provided
  - This function can access data from the previous run and modify the webhook payload

## 📦 Output

The Actor does not return any output. But it will log the following information:

- Success message confirming webhook trigger
- Response from N8N
- Error details if the trigger fails

## 🔍 Usage Examples

### Basic Usage

```json
{
    "webhookUrl": "https://hooks.N8N.com/hooks/catch/your-webhook-id",
    "data": {
        "message": "Hello from Apify!"
    }
}
```

### Advanced Usage with Data Transform

```json
{
    "webhookUrl": "https://hooks.N8N.com/hooks/catch/your-webhook-id",
    "data": {
        "initialData": "value"
    },
    "runId": "previous-actor-run-id",
    "transformFunction": "async function transformFunction(data, run, dataset, keyValueStore) {\n    const datasetData = await dataset.getData();\n    return {\n        ...data,\n        items: datasetData.items\n    };\n}"
}
```

## ⚙️ Technical Details

- Uses N8N's webhook URL to trigger the workflows
- Validates webhook URL format
- Stores transformed data in key-value store for debugging when using transformation
- Automatically handles webhook responses and error handling

## 🚨 Error Handling

The Actor will fail with clear error messages in the following cases:

- Missing input parameters
- Invalid webhook URL format
- Missing transform function when run ID is provided
- Failed webhook trigger
- Invalid or non-existent run ID when specified
