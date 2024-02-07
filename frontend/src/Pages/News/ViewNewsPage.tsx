import React, { useState, useEffect } from 'react';
import { fetchNewsById } from '../../Api/fetchNewsById';
import { NewsData } from '../../Types/NewsData';
import "./ViewNewsPage.css";
import { useParams } from 'react-router-dom';
import { formatDate, BackButton } from '../../Functions/custom';



const ViewNewsPage: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const [article, setArticle] = useState<NewsData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        document.title = 'Eurogamer Frontend - News';
    }, []);
    useEffect(() => {
        if (id) {
            const fetchArticle = async () => {
                setLoading(true);
                try {
                    const data = await fetchNewsById(parseInt(id));
                    if (data["error"]) {
                        setError(data["error"]);
                    } else {
                        setArticle(data);
                        document.title = 'Eurogamer Frontend - News - ' + data['title'];
                    }
                } catch (error) {
                    setError('Error fetching article. Please try again later.');
                    console.error('Error fetching article:', error);
                }
                setLoading(false);
            };
            fetchArticle();
        }

    }, [id]);

    return (
        <div className='container'>
            <div className='row mt-2'>
                <div className='col-lg'>
                    {!id && <div>No ID provided</div>}
                    {loading && <div>Loading...</div>}
                    {error && <div>{error}</div>}
                    {!id && <div>Loading...</div>}
                    {article ? (
                        <div>
                            <BackButton />
                            <div className='card'>
                                <div className='card-header'>
                                    <h2>{article.title}</h2>
                                    <p><b>{formatDate(article.publish_date)}</b></p>
                                </div>

                                <div className='card-body'>
                                    <div className='p-2' dangerouslySetInnerHTML={{ __html: article.description }}></div>
                                </div>

                                <div className='card-footer'>
                                    <a href={article.link} target="_blank" rel="noopener noreferrer" className='btn btn-outline-success'>Eurogamer Link</a>
                                </div>
                            </div>
                        </div>

                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default ViewNewsPage;
