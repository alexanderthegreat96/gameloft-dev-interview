import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavigationMenu from './Components/NavMenu/NavigationMenu';
import NewsPage from './Pages/News/ListNewsPage';
import VideosPage from './Pages/Videos/ListVideosPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-multi-carousel/lib/styles.css";
import ViewNewsPage from './Pages/News/ViewNewsPage';
import ViewVideosPage from './Pages/Videos/ViewVideosPage';
import HomePage from './Pages/Home/HomePage';
import SearchPage from './Pages/Search/SearchPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-lg'>
            <NavigationMenu />
            <Routes>
              <Route path='/' element={<HomePage />}></Route>
              <Route path='/news' element={<NewsPage />}></Route>
              <Route path='/news/:id' element={<ViewNewsPage />} />
              <Route path='/videos' element={<VideosPage />}></Route>
              <Route path='/videos/:id' element={<ViewVideosPage />} />
              <Route path='/search/' element={<SearchPage />}></Route>
            </Routes>
          </div>
        </div>

      </div>
    </Router>
  );
};

export default App;