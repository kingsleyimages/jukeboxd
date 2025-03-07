import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../../css/Admin.module.css'; 

function ModifyComment() {
  const { commentId } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [userId, setUserId] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); 
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL_PROD ||
    import.meta.env.VITE_API_BASE_URL_DEV;

  useEffect(() => {
    if (!commentId) {
      setErrorMessage('Invalid comment ID. Please go back and try again.');
      return;
    }

    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/api/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setComment(response.data.comment || '');
        setUserId(response.data.user_id || ''); 
      })
      .catch((error) => {
        setErrorMessage('An error occurred while fetching comment details');
      });
  }, [commentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentId) {
      setErrorMessage('Invalid comment ID. Cannot submit changes.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/comments/${commentId}`,
        { comment },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Set success message
      setSuccessMessage('Comment successfully modified');
      // Clear error message
      setErrorMessage('');

      // Navigate back to the user comments page after a delay
      setTimeout(() => {
        navigate(`/admin/users/${userId}/comments`);
      }, 2000);
    } catch (error) {
      console.error('Error details:', error);
      setErrorMessage('An error occurred while modifying comment details');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Modify Comment</h2>
      {errorMessage && <div className={styles.message} style={{ color: 'red' }}>{errorMessage}</div>}
      {successMessage && <div className={styles.message} style={{ color: 'green' }}>{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ color: 'black', backgroundColor: 'white' }} 
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default ModifyComment;