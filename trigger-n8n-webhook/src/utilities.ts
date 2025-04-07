import { log } from 'apify';

export async function apiCall(webhookUrl: string, data?: Record<string, unknown>) {
    log.info('Calling webhook with data', data);
    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
    });

    if (response.status !== 200) throw new Error(`Failed to trigger webhook: ${response.status}`);

    try {
        return await response.json();
    } catch (error) {
        throw new Error(`Failed to parse webhook response: ${error}`);
    }
}
