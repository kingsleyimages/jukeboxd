import React from 'react';

function UserComments({ userComments, handleDeleteComment }) {
  return (
    <div>
      <h2>User Comments</h2>
      <ul>
        {userComments.map((comment) => {
          console.log(`Comment ID: ${comment.id}`); // Add logging here
          return (
            <li key={comment.id}>
              <p><strong>Comment:</strong> {comment.comment}</p>
              <p><strong>Review ID:</strong> {comment.review_id}</p>
              <p><strong>Created At:</strong> {comment.created_at ? new Date(comment.created_at).toLocaleString() : 'N/A'}</p>
              <p><strong>Updated At:</strong> {comment.updated_at ? new Date(comment.updated_at).toLocaleString() : 'N/A'}</p>
              <button onClick={() => handleDeleteComment(comment.id)}>Delete Comment</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default UserComments;