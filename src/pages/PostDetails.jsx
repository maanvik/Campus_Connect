import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import EditPostForm from '../components/EditPostForm';
import './PostDetails.css'; 

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  async function fetchPostAndComments() {
    setLoading(true);
    try {
      
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (postError) throw postError;

      
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      setPost(postData);
      setComments(commentsData);
    } catch (error) {
      setError('Error fetching data: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleCommentAdded = (newComment) => {
    setComments([...comments, newComment]);
  };

  const handleUpvote = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({ upvotes: post.upvotes + 1 })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setPost({ ...post, upvotes: data.upvotes });
    } catch (error) {
      console.error('Error upvoting post:', error);
    }
  };

  const handlePostUpdated = (updatedPost) => {
    setPost(updatedPost);
    setIsEditing(false); 
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post? This will also delete all comments associated with this post.')) {
      try {
        
        const { error: commentsError } = await supabase
          .from('comments')
          .delete()
          .eq('post_id', id);
  
        if (commentsError) {
          throw commentsError;
        }
  
        
        const { error: postError } = await supabase
          .from('posts')
          .delete()
          .eq('id', id);
  
        if (postError) {
          throw postError;
        }
  
        
        navigate('/');
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete the post. Please try again.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="post-details">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Home
      </button>
      <div className="post-header">
          <h1 className="post-title">{post.title}</h1>
          <p className="post-content">{post.content}</p>
          {post.image_url && (
            <img 
              src={post.image_url} 
              alt={post.title} 
              className="post-image" 
            />
          )}
          <p className="post-date">Created at: {new Date(post.created_at).toLocaleString()}</p>
          <p className="post-upvotes">Upvotes: {post.upvotes}</p>
            <div className="post-buttons">
            <button className="upvote-button" onClick={handleUpvote}>Upvote</button>
            
            {isEditing ? (
              <EditPostForm postId={id} onPostUpdated={handlePostUpdated} />
            ) : (
              <>
                <button className="edit-button" onClick={() => setIsEditing(true)}>Edit Post</button>
                <button className="delete-button" onClick={handleDeletePost}>Delete Post</button>
              </>
            )}
          </div>
      </div>
      
      <CommentForm postId={id} onCommentAdded={handleCommentAdded} />
      <CommentList comments={comments} />
      
    </div>
  );
};

export default PostDetails;