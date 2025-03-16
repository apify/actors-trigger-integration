# Trigger Make.com scenario

## 🤖 What does this Actor do?

This Apify Actor triggers Make.com (formerly Integromat) scenarios using their API. It allows you to programmatically start scenarios and optionally enhance the trigger data with information from previous Actor runs.

**The Make.com API is only available for users with paid plans on Make.com.**

## ▶️ Input Configuration

### Required Parameters

- `zoneUrl` (string): Your Make.com zone URL (e.g., `https://eu1.make.com/`)
  - Must be a valid URL ending with a forward slash
  - Find your Zone URL by following [this guide](https://developers.make.com/api-documentation/getting-started/api-structure#base-url)

- `apiToken` (string): Your Make.com API token
  - Required permissions: `scenarios:read`, `scenarios:write`, and `scenarios:trigger`
  - You can generate an API token by following [this guide](https://developers.make.com/api-documentation/authentication/create-authentication-token)

- `scenarioId` (string): The ID of the Make.com scenario you wish to trigger
  - You can find the scenario ID by going to the scenario page and copying the ID from the URL
  - Example: `https://eu2.make.com/0000000/scenarios/1234567/edit` -> `1234567`

- `data` (object): Data to pass to the Make.com scenario
  - Default: `{}`
  - The data object will be passed to the Make.com scenario as the `data` parameter

### Advanced Options

- `runId` (string, optional): ID of an Apify Actor run to use as a data source
  - Only used when `transformFunction` is also provided

- `transformFunction` (string, optional): JavaScript function to transform data before sending to Make.com
  - Required when `runId` is provided
  - Function signature:

  ```javascript
  async function transformFunction(
      data,           // The input data object
      run,            // Output of Get run API call
      dataset,        // Dataset class instance
      keyValueStore   // KeyValueStore class instance
  ) {
      return data;    // Return transformed data
  }
  ```

## 📦 Output

The Actor does not return any output. But it will log the following information:

- Success message confirming scenario trigger
- Execution ID from Make.com
- Error details if the trigger fails

## 🔍 Usage Examples

### Basic Usage

```json
{
    "zoneUrl": "https://eu1.make.com/",
    "apiToken": "your-api-token",
    "scenarioId": "your-scenario-id",
    "data": {
        "message": "Hello from Apify!"
    }
}
```

### Advanced Usage with Data Transform

```json
{
    "zoneUrl": "https://eu1.make.com/",
    "apiToken": "your-api-token",
    "scenarioId": "your-scenario-id",
    "data": {
        "initialData": "value"
    },
    "runId": "previous-actor-run-id",
    "transformFunction": "async function transformFunction(data, run, dataset, keyValueStore) {\n    const datasetData = await dataset.getData();\n    return {\n        ...data,\n        items: datasetData.items\n    };\n}"
}
```

## ⚙️ Technical Details

- Uses Make.com's API v2 endpoints
- Validates scenario existence before triggering
- Stores transformed data in key-value store for debugging when using transformation
- Requires proper API permissions and valid zone URL
- Automatically handles API authentication and error responses

## 🚨 Error Handling

The Actor will fail with clear error messages in the following cases:

- Missing input parameters
- Invalid or inaccessible scenario ID
- Missing transform function when run ID is provided
- Failed scenario trigger
- Invalid or non-existent run ID when specified

## 📄 License

This project is licensed under the Apache License 2.0
