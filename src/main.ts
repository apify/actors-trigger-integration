import { Actor, log } from 'apify';
import { apiCall } from './utilities.js';

await Actor.init();

interface Input {
    zoneUrl: string;
    apiToken: string;
    scenarioId: string;
    data: Record<string, unknown>;
    runId?: string;
    transformFunction?: string;
}

// Structure of input is defined in input_schema.json
const input = await Actor.getInput<Input>();
if (!input) throw new Error('Input is missing!');

const { zoneUrl, apiToken, scenarioId, runId, transformFunction } = input;
let { data } = input;

// In case the user wants to use data from a previous run, they need to provide a transform function and the run ID
if (runId && !transformFunction) {
    await Actor.fail('The `transformFunction` option is required when `runId` is provided');
}

// We only apply the transform function if a run ID is provided
if (runId && transformFunction) {
    const client = Actor.apifyClient;
    const run = await client.run(runId).get();

    if (!run) {
        await Actor.fail(`Run "${runId}" not found`);
        process.exit(1);
    }

    log.info(`Found run with id "${runId}", transforming data...`);

    const { defaultDatasetId, defaultKeyValueStoreId } = run;

    const dataset = await Actor.openDataset(defaultDatasetId, { forceCloud: true });
    const keyValueStore = await Actor.openKeyValueStore(defaultKeyValueStoreId, { forceCloud: true });

    // Use the transform function to transform the data
    // eslint-disable-next-line no-new-func
    const transformFunctionObject = new Function(
        'data',
        'run',
        'dataset',
        'keyValueStore',
        `${transformFunction}\nreturn transformFunction(data, run, dataset, keyValueStore);`,
    );
    const transformedData = await transformFunctionObject(data, run, dataset, keyValueStore);

    const defaultKeyValueStore = await Actor.openKeyValueStore();
    await defaultKeyValueStore.setValue('data', transformedData);
    log.info(`Data transformation complete, the final data object for the scenario is stored in the default key value store for debugging purposes`);
    data = transformedData;
}

const getScenarioResponse = await apiCall(zoneUrl, apiToken, `api/v2/scenarios/${scenarioId}`, 'GET');

// If the user doesn't have access to the scenario, or the scenario doesn't exist, let's fail early
if (!getScenarioResponse.scenario) {
    let errorMessage = `Scenario ${scenarioId} not found`;
    if (getScenarioResponse.detail) errorMessage += `: ${getScenarioResponse.detail}`;
    await Actor.fail(errorMessage);
}

const { scenario } = getScenarioResponse;
log.info(`Found scenario`, scenario);

const { name } = scenario;

const runScenarioResponse = await apiCall(zoneUrl, apiToken, `api/v2/scenarios/${scenarioId}/run`, 'POST', data);

// If the scenario failed to trigger, let's fail early
if (!runScenarioResponse.executionId) {
    let errorMessage = `Scenario ${name} failed to trigger`;
    if (runScenarioResponse.detail) errorMessage += `: ${runScenarioResponse.detail}`;
    await Actor.fail(errorMessage);
}

// Everything went well, let's save the statusUrl and exit
log.info(`Scenario ${name} triggered`, { runScenarioResponse });

await Actor.exit(`Scenario ${name} triggered`);
