import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <>
     <div>
      <h1>Admin Dashboard</h1>
    </div>
    <div>
      <Link to="/admin/dashboard/users">View All Users</Link>
      <Link to="/admin/dashboard/comments">View All Comments</Link>
      <Link to="/admin/dashboard/reviews">View All Reviews</Link>
    </div>
    </>
   
  );
};

export default AdminDashboard;