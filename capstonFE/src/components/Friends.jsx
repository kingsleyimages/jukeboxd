import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../css/Friends.module.css';

function Friends() {
  const API_BASE_URL = 'http://localhost:3000';

  const navigate = useNavigate();
  const [friendsList, setFriendsList] = useState([]);
  const [friendsAvailable, setFriendsAvailable] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFriendsLoading, setIsFriendsLoading] = useState(false);
  const [friendsError, setFriendsError] = useState(null);

  // For debugging purposes
  useEffect(() => {
    console.log('Token in localStorage:', localStorage.getItem('token'));
    console.log('User in localStorage:', localStorage.getItem('user'));
  }, []);

  // Check authentication and fetch user data
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Checking token:', token ? 'exists' : 'missing');

    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const userDataStr = localStorage.getItem('user');
        console.log(
          'User data in localStorage:',
          userDataStr ? 'exists' : 'missing'
        );

        if (userDataStr) {
          try {
            const parsedUserData = JSON.parse(userDataStr);
            console.log('Parsed user data:', parsedUserData);

            if (parsedUserData && parsedUserData.username) {
              setUserData(parsedUserData);
              setIsLoading(false);
              return;
            }
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
          }
        }

        console.log('Fetching user data from API...');
        const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('API response:', response.data);

        if (
          response.data &&
          (response.data.username ||
            (response.data.user && response.data.user.username))
        ) {
          const userData = response.data.user || response.data;
          setUserData(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          throw new Error('Invalid user data format received from API');
        }
      } catch (apiError) {
        console.error('API fetch error:', apiError);

        if (apiError.response) {
          if (apiError.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login', {
              state: {
                message: 'Your session has expired. Please log in again.',
              },
            });
            return;
          }

          setError(
            `Server error: ${
              apiError.response.data?.message || apiError.response.statusText
            }`
          );
        } else if (apiError.request) {
          setError(
            'Cannot connect to server. Please check your internet connection.'
          );
        } else {
          setError(
            'Failed to load account information. Please try again later.'
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, API_BASE_URL]);

  useEffect(() => {
    if (userData && userData.id) {
      fetchFriends(userData.id);
    }
  }, [userData]);

  const fetchFriends = async (userId) => {
    setIsFriendsLoading(true);
    setFriendsError(null);

    try {
      const token = localStorage.getItem('token');

      const friendsResponse = await axios.get(
        `${API_BASE_URL}/api/friends/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Friends list:', friendsResponse.data);
      setFriendsList(friendsResponse.data);

      const availableResponse = await axios.get(
        `${API_BASE_URL}/api/friends/available/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Friends available:', availableResponse.data);
      setFriendsAvailable(availableResponse.data);
    } catch (error) {
      console.error('Error fetching friends data:', error);
      setFriendsError(
        "Failed to load friends' activity. Please try again later."
      );
    } finally {
      setIsFriendsLoading(false);
    }
  };

  const handleClick = async (friend) => {
    console.log('Adding friend:', friend);
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/api/friends/add`,
      {
        userId: userData.id,
        friendId: friend.id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetchFriends(userData.id);
    console.log('Friend added:', response.data);
  };

  const handleRemove = async (friend) => {
    console.log('Removing friend:', friend);
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/api/friends/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        userId: userData.id,
        friendId: friend.id,
      },
    });
    fetchFriends(userData.id);
    console.log('Friend removed:', response.data);
  };

  return (
    <>
      <div className={styles.friendsWrapper}>
        <div className={styles.column}>
          <h1 className={styles.title}>Friends:</h1>
          {friendsList.length > 0 ? (
            friendsList.map((friend) => (
              <div className={styles.friends} key={friend.id}>
                {friend.username}
                <button onClick={() => handleRemove(friend)}>
                  Remove Friend
                </button>
              </div>
            ))
          ) : (
            <p>No Friends to display.</p>
          )}
        </div>
        <div className={styles.column}>
          <h1 className={styles.title}>Available Friends:</h1>
          {friendsAvailable.length > 0 ? (
            friendsAvailable.map((friend) => (
              <div
                className={`${styles.friends} ${styles.available}`}
                key={friend.id}>
                {friend.username}
                <button onClick={() => handleClick(friend)}>Add Friend</button>
              </div>
            ))
          ) : (
            <p>No available friends to display.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Friends;
