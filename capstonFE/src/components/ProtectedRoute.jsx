import { Navigate, Outlet } from 'react-router-dom';
import React from 'react';

function ProtectedRoute({ adminOnly = false }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')); // Assuming you store user details in localStorage

  if (!token) return <Navigate to="/login" />;

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/not-authorized" />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
