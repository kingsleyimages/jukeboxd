import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ModifyComment() {
  const { commentId } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


    const API_BASE_URL = import.meta.env.MODE === 'production' 
    ? import.meta.env.VITE_API_BASE_URL_PROD
    : import.meta.env.VITE_API_BASE_URL_DEV;

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/api/comments/${commentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setComment(data.comment);
      })
      .catch((error) => {
        console.error('Error fetching comment details:', error);
        setErrorMessage("An error occurred while fetching comment details");
      });
  }, [commentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/admin/comments/${commentId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comment })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      navigate(`/admin/user/${userId}/comments`);
    } catch (error) {
      console.error('Error modifying comment:', error);
      setErrorMessage("An error occurred while modifying comment details");
    }
  };

  return (
    <div>
      <h2>Modify Comment</h2>
      {errorMessage && <div>{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default ModifyComment;