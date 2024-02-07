import { useNavigate } from 'react-router-dom';

export const stripHtmlTags = (html: string, limit: number = 100): string => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    let content = tmp.textContent || tmp.innerText || '';
    content = content.trim().substring(0, limit);
    if (content.length === limit && html.length > limit) {
        content += '...';
    }
    return content;
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export const BackButton = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <p>
            <button onClick={handleGoBack} className='btn btn-secondary btn-sm'>
                Go Back
            </button>
        </p>
    );
}
