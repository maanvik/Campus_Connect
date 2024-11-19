import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './CommentForm.css';

const CommentForm = ({ postId, onCommentAdded }) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('comments')
                .insert({ post_id: postId, content })
                .select()
                .single();

            if (error) throw error;

            setContent('');
            onCommentAdded(data);
        } catch (error) {
            setError('Failed to add comment. Try Again');
            console.error('Error adding comment', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="comment-form">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a comment..."
                rows="3"
                disabled={isSubmitting}
                className="comment-textarea" 
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit" disabled={isSubmitting || !content.trim()} className="comment-button">
                {isSubmitting ? 'Submitting...' : 'Add Comment'}
            </button>
        </form>
    );
};

export default CommentForm;