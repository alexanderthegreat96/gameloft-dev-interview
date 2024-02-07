export const fetchNewsById = async (id: number = 1) => {
    const apiUrl = process.env.REACT_APP_API_URL
    const apiKey = process.env.REACT_APP_API_AUTHENTICATION_KEY;

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

        const response = await fetch(apiUrl + '/api/news/' + id, {
            method: 'GET',
            headers: headers
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
};