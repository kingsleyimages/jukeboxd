import React from 'react';
import styles from '../../../css/Admin.module.css';

function UserInfo({ user }) {
  return (
    <div className={styles.userInfoContainer}>
      <h2>User Details</h2>
      {user && (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}
    </div>
  );
}

export default UserInfo;