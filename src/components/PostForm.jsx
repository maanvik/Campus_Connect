import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './PostForm.css';

const PostForm = () => {
    const [title, setTitle] = useState('');
    const navigate = useNavigate();
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        try {
            let imageUrl = null;
            if (image) {
                const fileExt = image.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('post-images')
                    .upload(fileName, image);

                if (uploadError) {
                    throw uploadError;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('post-images')
                    .getPublicUrl(fileName);
                
                imageUrl = publicUrl;
            }

            const { data, error } = await supabase
                .from('posts')
                .insert([
                    { title, content, image_url: imageUrl }
                ]);

            if (error) {
                throw error;
            }

            setSuccessMessage('Post created successfully!');
            setTitle('');
            setContent('');
            setImage(null);

            navigate('/');

        } catch (error) {
            console.error('Error creating Post: ' + error.message);
            setErrorMessage('Error creating Post: ' + error.message);
        }
    };

    return (
        <div className="post-form-container">
            <h1 className="post-form-title">Create a New Post</h1>  
            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <form onSubmit={handleSubmit} className="post-form">
                <div className="form-group">
                    <label htmlFor="title" className="form-label">Title:</label>
                    <input 
                        type="text" 
                        id="title"
                        className="form-input"
                        placeholder="What's happening?" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content" className="form-label">Content:</label>
                    <textarea 
                        id="content"
                        className="form-textarea"
                        placeholder="Add more details..." 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image" className="form-label">Image:</label>
                    <input 
                        type="file" 
                        id="image"
                        className="form-file-input"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <button type="submit" className="submit-button">Post</button>
            </form>          
        </div>        
    );
}

export default PostForm;