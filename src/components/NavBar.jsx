import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">Campus Connect</Link>
                <div className="navbar-links">
                    <Link to="/" className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                    <Link to="/create" className={`navbar-link ${location.pathname === '/create' ? 'active' : ''}`}>Create Post</Link>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;