import React from 'react';
import './SortOptions.css';

const SortOptions = ({ sortBy, onSortChange }) => {
    return (
        <div className="sort-options">
            <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
                <option value="created_at">Most Recent</option>
                <option value="upvotes">Most Upvotes</option>
                <option value="title">Title</option>
            </select>
        </div>
    );
};

export default SortOptions;