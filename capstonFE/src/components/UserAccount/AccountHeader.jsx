import React from "react";

const AccountHeader = ({ onLogout }) => {
  return (
    <div className="account-header">
      <h1>My Account</h1>
      <button className="logout-button" onClick={onLogout}>
        Log Out
      </button>
    </div>
  );
};

export default AccountHeader;