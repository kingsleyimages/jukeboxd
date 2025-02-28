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
      <br />
      <Link to="/admin/dashboard/reviewed-albums">View All Reviewed Albums</Link>
    </div>
    </>
   
  );
};

export default AdminDashboard;