export const fetchSearchData = async (page: number = 1, keywords: string) => {

    const apiKey = process.env.REACT_APP_API_AUTHENTICATION_KEY;
    const perPage = process.env.REACT_APP_ITEMS_PER_PAGE;
    const apiUrl = process.env.REACT_APP_API_URL


    if (!apiUrl) {
        throw new Error('API URL not found.');
    }
    if (!apiKey) {
        throw new Error('API key not found.');
    }

    if (!perPage) {
        throw new Error('Per Page is not not defined.');
    }

    try {

        const headers = {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
        };

        const response = await fetch(`${apiUrl}/api/search?query=${encodeURIComponent(keywords)}&page=${page}&per_page=${perPage}`, {
            method: 'GET',
            headers: headers
        });

        console.log(keywords);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching:', error);
        return [];
    }
};