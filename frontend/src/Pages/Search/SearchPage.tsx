import React, { useEffect, useState } from 'react';
import { fetchSearchData } from '../../Api/fetchSearchData';
import { fetchSearchHistory } from '../../Api/fetchSearchHistory';
import { formatDate } from '../../Functions/custom';
import { SearchData } from '../../Types/SearchData';
import { SearchHistory } from '../../Types/SearchHistory';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearSearchHistory } from '../../Api/clearSearchHistory';

const LoadingText = () => <div className='text-center'>Loading...</div>;
const ErrorText = ({ error }: { error: string }) => <div className='text-center'>Error: {error}</div>;

const SearchPage: React.FC = () => {
    const [historyError, setHistoryError] = useState<string | null>(null);
    const [historyLoading, setHistoryLoading] = useState<boolean>(false);
    const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
    const [searchResults, setSearchResults] = useState<SearchData[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [keywords, setKeywords] = useState<string>('');

    const maxVisiblePages = 5;
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialKeywords = searchParams.get("keywords") ?? "";
    const initialPage = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;

    useEffect(() => {
        document.title = 'Eurogamer Frontend - Search News and Videos';
    }, []);

    // fetch search history
    useEffect(() => {
        const fetchHistory = async () => {
            setHistoryLoading(true);
            try {
                const data = await fetchSearchHistory();
                if (data['data']) {
                    setSearchHistory(data["data"]);
                } else {
                    setHistoryError(data['error']);
                }
            } catch (error) {
                setHistoryError('Unable to fetch history results: ' + error);
                console.error('Error fetching search history:', error);
            }
            setHistoryLoading(false);
        };

        fetchHistory();
    }, []);

    // set initial page
    useEffect(() => {
        setPage(initialPage);
    }, [initialPage]);


    // set initial keywords
    useEffect(() => {
        setKeywords(initialKeywords);
    }, [initialKeywords]);

    // handle searching when keywords are provided
    useEffect(() => {
        if (keywords) {
            const fetchResults = async () => {
                setLoading(true);
                try {
                    const data = await fetchSearchData(page, keywords);
                    if (data["error"]) {
                        setError(data["error"]);
                    } else {
                        setSearchResults(data['data'])
                    }

                    setTotalPages(data["last_page"]);
                    setTotalResults(data["total"]);
                } catch (error) {
                    setError('Unable to fetch search results.');
                    console.error('Error fetching article:', error);
                }
                setLoading(false);
            };
            fetchResults();
        } else {
            // if no keywords are provided, attempt to grab the last
            // used keyword to search
            // from the history
            if (searchHistory.length > 0) {
                const lastSearch = searchHistory[0];
                if (lastSearch) {
                    const lastKeywords = lastSearch.keywords;
                    const fetchResults = async () => {
                        setLoading(true);
                        try {
                            const data = await fetchSearchData(page, lastKeywords);
                            if (data["error"]) {
                                setError(data["error"]);
                            } else {
                                setSearchResults(data['data'])
                                setKeywords(lastKeywords)
                            }

                            setTotalPages(data["last_page"]);
                            setTotalResults(data["total"]);
                        } catch (error) {
                            setError('Unable to fetch search results.');
                            console.error('Error fetching article:', error);
                        }
                        setLoading(false);
                    };
                    fetchResults();
                }
            }

        }
    }, [keywords, page, searchHistory]);

    // page change, nothing special
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        navigate(`?keywords=${encodeURIComponent(keywords)}&page=${newPage}`);

    };

    // handle the searching and updating of history 
    // if results are found
    const handleSearch = async () => {
        const inputKeywords = (document.getElementById('keywords') as HTMLInputElement)?.value || '';
        if (inputKeywords.trim() !== '') {
            if (inputKeywords.length > 4) {
                setKeywords(inputKeywords);
                setPage(1);
                navigate(`?keywords=${encodeURIComponent(inputKeywords)}`);

                try {
                    const searchData = await fetchSearchData(1, inputKeywords);
                    setSearchResults(searchData.data);

                    const historyData = await fetchSearchHistory();
                    if (historyData['data']) {
                        setSearchHistory(historyData.data);
                    }
                } catch (error) {
                    console.error('Error fetching search data:', error);
                    setError('Error fetching search data');
                }
            } else {
                setError('Your query has to have at least 4 characters.')
            }

        } else {
            setError('Please provide keywords');
        }
    };

    // clearing individual history elements or all
    const handleClearAll = async () => {
        try {
            await clearSearchHistory();
            const historyData = await fetchSearchHistory();
            setSearchHistory(historyData.data);
        } catch (error) {
            console.error('Unable to clear search history:', error);
            setHistoryError('Unable to clear search history');
        }
    }
    const handleDelete = async (id: number) => {
        try {
            await clearSearchHistory(id);
            const historyData = await fetchSearchHistory();
            setSearchHistory(historyData.data);
        } catch (error) {
            console.error('Unable to clear search history:', error);
            setHistoryError('Unable to clear search history');
        }
    }

    // pagination data
    const paginationLinks = [];
    for (let i = 1; i <= totalPages; i++) {
        if (totalPages > maxVisiblePages) {
            const halfVisiblePages = Math.floor(maxVisiblePages / 2);
            const lowerLimit = Math.max(1, page - halfVisiblePages);
            const upperLimit = Math.min(totalPages, page + halfVisiblePages);
            if (i === 1 && page > halfVisiblePages + 1) {
                paginationLinks.push(<li key="ellipsis-start" className="page-item disabled"><span className="page-link">...</span></li>);
            }
            if (i === totalPages && page < totalPages - halfVisiblePages) {
                paginationLinks.push(<li key="ellipsis-end" className="page-item disabled"><span className="page-link">...</span></li>);
            }
            if (i < lowerLimit || i > upperLimit) {
                continue;
            }
        }
        paginationLinks.push(
            <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
                <button className='page-link' onClick={() => handlePageChange(i)}>
                    {i}
                </button>
            </li>
        );
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-lg text-center'><h3>Search News and Videos</h3></div>
            </div>
            <div className='row mt-2 mb-2'>
                <div className='col-lg'>
                    <div className='form-inline'>
                        <div className='row'>
                            <div className='col-lg-10 col-md-10 col-12'>
                                <input type='text' className='form-control' id='keywords' placeholder='Type your keywords here...' />
                            </div>
                            <div className='col-lg-2 col-md-2 col-12'>
                                <button type='button' onClick={handleSearch} className='w-100 btn btn-outline-primary'>Search</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row mt-3'>
                <div className='col-lg-4 col-md-4 col-12 mb-2'>
                    <h6>Latest Searches</h6>
                    <hr />

                    <div>
                        {historyLoading && <LoadingText />}
                        {historyError && <ErrorText error={historyError} />}
                        {!historyLoading && searchHistory.length === 0 && (
                            <div className='text-center'>Search History is empty.</div>
                        )}
                        {searchHistory.map((entry) => (
                            <div className="clearfix">
                                <div className="float-start p-2"><a href={`/search/?keywords=${entry.keywords}`}>{entry.keywords}</a></div>
                                <div className="float-end p-2"><button onClick={() => handleDelete(entry.id)} className='btn btn-sm btn-outline-danger'>Clear</button></div>
                            </div>
                        ))}
                        {searchHistory.length > 0 && (
                            <div className='text-right mt-3'>
                                <button onClick={handleClearAll} className='btn btn-sm btn-outline-danger'>Clear All</button>
                            </div>
                        )}

                    </div>
                </div>
                <div className='col-lg-8 col-md-8 col-12'>
                    <h6>Search Results</h6>
                    <hr />
                    {loading && <LoadingText />}
                    {error && <ErrorText error={error} />}
                    {!loading && searchResults.length === 0 && (!keywords || keywords.trim() === '') && (
                        <div className='text-center'>Type something to search</div>
                    )}
                    {!loading && searchResults.length === 0 && keywords && keywords.length > 0 && (
                        <div className='text-center'>No results found</div>
                    )}

                    {searchResults.length > 0 && (
                        <div className="clearfix">
                            <div className='float-start p-2'>Found <b>{totalResults}</b> results for: <i>{keywords}</i></div>
                            <div className='float-end p-2'>Page: <b>{page}</b></div>
                        </div>

                    )}
                    {searchResults.map((result: SearchData) => (
                        <div key={result.id} className='card mt-2'>
                            <div className='card-header'>
                                {result.type === 'videos' ? (
                                    <a href={`/videos/${result.id}`}><h2>{result.title}</h2></a>
                                ) : (
                                    <a href={`/news/${result.id}`}><h2>{result.title}</h2></a>
                                )}
                                <p><b>{formatDate(result.publish_date)}</b></p>
                            </div>
                            <div className='card-body'>
                                <div className='p-2' dangerouslySetInnerHTML={{ __html: result.description }}></div>
                            </div>
                            <div className='card-footer'>
                                <a href={result.link} target="_blank" rel="noopener noreferrer" className='btn btn-outline-success btn-sm'>On Eurogamer</a>
                            </div>
                        </div>
                    ))}

                    {searchResults.length > 0 && totalPages > 1 && (
                        <div className='pagination justify-content-center mt-2'>
                            <nav aria-label='Page navigation'>
                                <ul className='pagination'>
                                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                        <button className='page-link' onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                                            Previous
                                        </button>
                                    </li>
                                    {paginationLinks}
                                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                        <button className='page-link' onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
            <hr />
        </div >
    );
};

export default SearchPage;
