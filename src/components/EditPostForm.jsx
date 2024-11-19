import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './EditPostForm.css'; 

const EditPostForm = ({ postId, onPostUpdated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) {
        setError('Error fetching post data.');
      } else {
        setTitle(data.title);
        setContent(data.content);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('posts')
        .update({ title, content })
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;

      onPostUpdated(data);
      setTitle('');
      setContent('');
    } catch (error) {
      setError('Failed to update post.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-post-form">
      <input
        type="text"
        className="edit-post-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        className="edit-post-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
      />
      {error && <p className="error-message">{error}</p>}
      <button type="submit" className="edit-post-button" disabled={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update Post'}
      </button>
    </form>
  );
};

export default EditPostForm;