import React, { useEffect, useState, useRef } from 'react';
import { fetchVideos } from '../../Api/fetchVideos';
import Carousel from "react-multi-carousel";
import { VideosData } from '../../Types/VideosData';
import { stripHtmlTags } from '../../Functions/custom';
import Pagination from 'react-bootstrap/Pagination';

const VideosPage: React.FC = () => {
    const [videos, setvideos] = useState<VideosData[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef<Carousel>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.title = 'Eurogamer Frontend - Videos';
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const result = await fetchVideos(page);
            if (result && result.data) {
                setvideos(prevVideos => [...prevVideos, ...result.data]);
            } else {
                setError('No videos to show.');
            }
            setLoading(false);
        };

        fetchData();
    }, [page]);

    const handleNext = async () => {
        if (!loading) {
            const totalItems = videos.length;
            const itemsPerPage = 4;
            const newIndex = currentIndex + itemsPerPage;

            if (newIndex >= totalItems) {
                setLoading(true);
                try {
                    await setPage(prevPage => prevPage + 1);
                } catch (error) {
                    console.error('Error setting page:', error);
                } finally {
                    setLoading(false);
                }
            }

            setCurrentIndex(newIndex);
            carouselRef.current?.next(itemsPerPage);

            setPage(prevPage => {
                return prevPage + 1;
            });

        }
    };

    const handlePrevious = () => {
        const newIndex = currentIndex - 4;
        if (newIndex >= 0) {
            setCurrentIndex(newIndex);
            carouselRef.current?.previous(4);
        }
    };

    const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
    };

    return (
        <div className='container'>
            <div className='row mt-2'>
                <div className='col-lg'>
                    <div className='col-md-12'>
                        <div className='card'>
                            <div className='card-header'>
                                <h4>Latest Videos</h4>
                            </div>
                            {loading && (
                                <div className='card-body'>Loading videos...</div>
                            )}
                            {error && videos.length < 1 && (
                                <div className='card-body'>No videos to show.</div>
                            )}
                            {!error && videos.length > 0 && (
                                <div>
                                    <div className='card-body'>
                                        <Carousel
                                            ref={carouselRef}
                                            responsive={responsive}
                                            arrows={false}
                                            dotListClass="custom-dot-list-style"
                                            containerClass="container-fluid"
                                            itemClass="p-3 col-md-3"
                                        >
                                            {videos.map((item: VideosData) => (
                                                <div key={item.id}>
                                                    <a href={`/videos/${item.id}`}>
                                                        <img
                                                            src={item.thumbnail}
                                                            alt={item.title}
                                                            style={{ maxWidth: '100%', height: 'auto' }}
                                                        />
                                                    </a>
                                                    <p className="h4">{item.title}</p>
                                                    <p>{stripHtmlTags(item.description, 200)}</p>
                                                    <a href={item.link} className="btn btn-outline-primary btn-sm" target="_blank" rel="noopener noreferrer">Read more</a>
                                                </div>
                                            ))}
                                        </Carousel>
                                    </div>
                                    <div className='card-footer'>
                                        <Pagination>
                                            <Pagination.Prev onClick={handlePrevious} disabled={loading || currentIndex === 0}>Previous</Pagination.Prev>
                                            <Pagination.Next onClick={handleNext} disabled={loading}>Next</Pagination.Next>
                                        </Pagination>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default VideosPage;
