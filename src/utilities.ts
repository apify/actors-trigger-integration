export async function apiCall(zoneUrl: string, apiToken: string, path: string, method: string, data?: Record<string, unknown>) {
    const response = await fetch(`${zoneUrl}${path}`, {
        method,
        headers: {
            Authorization: `Token ${apiToken}`,
            'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
    });

    return response.json();
}
