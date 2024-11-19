import React from 'react';
import { Link } from 'react-router-dom';
import './PostCard.css';

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <h2 className="post-title">{post.title}</h2>
      <p className="post-meta">
        <span className="post-date">{new Date(post.created_at).toLocaleString()}</span>
        <span className="post-upvotes">Upvotes: {post.upvotes}</span>
      </p>
      <Link to={`/post/${post.id}`} className="post-link">View Details</Link>
    </div>
  );
};

export default PostCard;