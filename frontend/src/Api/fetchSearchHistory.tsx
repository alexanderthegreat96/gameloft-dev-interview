export const fetchSearchHistory = async (page: number = 1) => {
    const apiKey = process.env.REACT_APP_API_AUTHENTICATION_KEY;
    const apiUrl = process.env.REACT_APP_API_URL;
    const historyLimit = process.env.REACT_APP_SEARCH_ITEM_HISTORY_LIMIT

    if (!apiUrl) {
        throw new Error('API URL not found.');
    }
    if (!apiKey) {
        throw new Error('API key not found.');
    }

    if (!historyLimit) {
        throw new Error('Limit for history is not defined.');
    }

    try {
        const headers = {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
        };

        const response = await fetch(`${apiUrl}/api/history?page=${page}&per_page=${historyLimit}`, {
            method: 'GET',
            headers: headers
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching search history:', error);
        return [];
    }
};
