import React from "react";
import { Link } from "react-router-dom";
import styles from '../../css/Admin.module.css'; // Import the styles

const AdminDashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <h1>Admin Dashboard</h1>
      <div>
        <Link to="/admin/dashboard/users">View All Users</Link>
        <br />
        <Link to="/admin/dashboard/reviewed-albums">View All Reviewed Albums</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;