import React from 'react';
import { Link } from 'react-router-dom';

const NavigationMenu: React.FC = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/">Eurogamer</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/news">News</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/videos">Videos</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/search">Search</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavigationMenu;