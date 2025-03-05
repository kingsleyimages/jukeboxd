import React from 'react';
import styles from '../../../css/Admin.module.css';

function UserComments({ userComments, handleDeleteComment }) {
  return (
    <div className={styles.userCommentsContainer}>
      <div className={styles.userCommentsHeader}>
        <h2>User Comments</h2>
      </div>
      <ul className={styles.commentList}>
        {userComments.map((comment) => {
          console.log(`Comment ID: ${comment.id}`); // Add logging here
          return (
            <li key={comment.id}>
              <div className={styles.commentDetails}>
                <p><strong>Comment:</strong> {comment.comment}</p>
                <p><strong>Review ID:</strong> {comment.review_id}</p>
                <p><strong>Created At:</strong> {comment.created_at ? new Date(comment.created_at).toLocaleString() : 'N/A'}</p>
                <p><strong>Updated At:</strong> {comment.updated_at ? new Date(comment.updated_at).toLocaleString() : 'N/A'}</p>
                <button onClick={() => handleDeleteComment(comment.id)} className={styles.deleteButton}>Delete Comment</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default UserComments;