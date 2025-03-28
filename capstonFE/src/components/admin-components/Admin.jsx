import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashBoard";
import UserDetails from "./UserDetails";
import ViewAllUsers from "./ViewAllUsers";
import ReviewedAlbums from "./ReviewedAlbums";
import UserReviewsPage from "./UserReviewsPage";
import UserCommentsPage from "./UserCommentsPage";
import UserModify from "./modify-components/UsersModify";
import ModifyReview from "./modify-components/ModifyReview";
import ModifyComment from "./modify-components/ModifyComment";

const Admin = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/dashboard/users" element={<ViewAllUsers />} />
      <Route path="/dashboard/reviewed-albums" element={<ReviewedAlbums />} />
      <Route path="/users/:userId" element={<UserDetails />} />
      <Route path="/users/:userId/reviews" element={<UserReviewsPage />} />
      <Route path="/users/:userId/comments" element={<UserCommentsPage />} />
      <Route path="/users/:userId/modify" element={<UserModify />} />
      <Route path="/reviews/:reviewId/modify" element={<ModifyReview />} />
      <Route path="/comments/:commentId/modify" element={<ModifyComment />} />
    </Routes>
  );
};

export default Admin;