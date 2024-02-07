export const clearSearchHistory = async (id: number = 0) => {
    const apiKey = process.env.REACT_APP_API_AUTHENTICATION_KEY;
    const apiUrl = process.env.REACT_APP_API_URL;

    if (!apiUrl) {
        throw new Error('API URL not found.');
    }
    if (!apiKey) {
        throw new Error('API key not found.');
    }

    try {
        const headers = {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
        };

        let requestUrl = "";

        if (id !== 0) {
            requestUrl = `${apiUrl}/api/history/delete/` + id
        } else {
            requestUrl = `${apiUrl}/api/history/delete-all`
        }

        const response = await fetch(requestUrl, {
            method: 'DELETE',
            headers: headers
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error wiping history:', error);
        return [];
    }
};
