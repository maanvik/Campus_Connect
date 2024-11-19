import React from 'react';

const CommentList = ({ comments }) => {

    if ( comments.length === 0){

        return <p> Grab the opportunity to first share your opinion !</p> ;
    }

    return (
        <div className="comment-list">
            <h3>({comments.length}) Comments</h3>
            {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                    <p>{comment.content}</p>
                    <small>
                        Posted on : {new Date(comment.created_at).toLocaleString()}
                    </small>
                </div>
            ))}
        </div>
    );

};

export default CommentList;