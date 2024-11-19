import React, { useState, useEffect } from "react";
import { supabase } from '../supabaseClient';
import PostList from '../components/PostList';
import SearchBar from '../components/SearchBar';
import SortOptions from '../components/SortOptions';
import './Home.css';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('created_at');

    useEffect(() => {
        fetchPosts();
    }, [sortBy, searchTerm]);

    async function fetchPosts() {
        setLoading(true);
        try {
            let query = supabase
                .from('posts')
                .select('*')

            if (searchTerm) {
                query = query.ilike('title', `%${searchTerm}%`);
            }

            if (sortBy === 'upvotes') {
                query = query.order('upvotes', { ascending: false });
            } else if (sortBy === 'title') {
                query = query.order('title');
            } else {
                query = query.order('created_at', { ascending: false });
            }

            const { data, error } = await query;

            if (error) throw error;
            setPosts(data);
        } catch (error) {
            setError('Error fetching posts: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const handleSortChange = (value) => {
        setSortBy(value);
    };

    return (
        <div className="home-container">
            <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
            <SortOptions sortBy={sortBy} onSortChange={handleSortChange} />
            {loading ? (
                <p className="loading-message">Loading posts...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <PostList posts={posts} />
            )}
        </div>
    );
}

export default Home;