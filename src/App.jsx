import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import PostDetails from './pages/PostDetails'
import NavBar from './components/NavBar'
import './App.css'

function App() {
    return (
        <Router>
            <div className="app-container">
                <NavBar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/create" element={<CreatePost />} />
                        <Route path="/post/:id" element={<PostDetails />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;