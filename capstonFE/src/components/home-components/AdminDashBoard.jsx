import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../Login";
import ViewAllUsers from "../admin-components/ViewAllUsers";
import ViewAllComments from "../admin-components/ViewAllCOmments";

const AdminDashboard = () => {
  return (
    <>
     <div>
      <h1>Admin Dashboard</h1>
    </div>
    <div>
      <Link to="/admin/dashboard/users">View All Users</Link>
    </div>
    </>
   
  );
};

export default AdminDashboard;