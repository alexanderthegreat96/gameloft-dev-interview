import VideosPage from "../Videos/ListVideosPage";
import NewsPage from "../News/ListNewsPage";
import { useEffect } from "react";
const HomePage: React.FC = () => {
    useEffect(() => {
        document.title = 'Eurogamer Frontend - Home';
    }, []);
    return (
        <div>
            <div>{<NewsPage />}</div>
            <div>{<VideosPage />}</div>
        </div>
    );
}

export default HomePage;