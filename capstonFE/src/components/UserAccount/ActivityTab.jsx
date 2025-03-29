import React from "react";

const ActivityTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="activity-tabs">
      <button
        className={`tab-button ${activeTab === "myActivity" ? "active" : ""}`}
        onClick={() => setActiveTab("myActivity")}>
        My Activity
      </button>
      <button
        className={`tab-button ${
          activeTab === "friendsActivity" ? "active" : ""
        }`}
        onClick={() => setActiveTab("friendsActivity")}>
        Friends' Activity
      </button>
      <button
        className={`tab-button ${activeTab === "friends" ? "active" : ""}`}
        onClick={() => setActiveTab("friends")}>
        See and Find Friends
      </button>
    </div>
  );
};

export default ActivityTabs;