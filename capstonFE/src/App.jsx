import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext"; 
import Discover from "./components/Discover";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Me from "./components/Me";
import Home from "./components/Home";
import Mixtapes from "./components/Mixtapes";
import Search from "./components/Search";
import Register from "./components/Register";
import Login from "./components/Login";
import Callback from "./components/Callback";
import AllReviews from "./components/AllReviews";
import SingleAlbumDetails from "./components/SingleAlbumDetails";
import AdminDashboard from "./components/home-components/AdminDashBoard";
import UserDetails from "./components/admin-components/UserDetails";
import ViewAllUsers from "./components/admin-components/ViewAllUsers";
import ReviewedAlbums from "./components/admin-components/ReviewedAlbums";
import UserReviewsPage from "./components/admin-components/UserReviewsPage";
import UserCommentsPage from "./components/admin-components/UserCommentsPage";
import UserModify from "./components/admin-components/modify-components/UsersModify";
import ModifyReview from "./components/admin-components/modify-components/ModifyReview";
import ModifyComment from "./components/admin-components/modify-components/ModifyComment";
import InactivityLogoutTimer from './components/InactivtyLogoutTimer';

function App() {
    return (
        <AuthProvider> {/* Wrap your app with AuthProvider */}
            <BrowserRouter>
                <InactivityLogoutTimer />
                <Navbar />
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/account" element={<Me />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/dashboard/users" element={<ViewAllUsers />} />
                        <Route path="/admin/dashboard/reviewed-albums" element={<ReviewedAlbums />} />
                        <Route path="/admin/users/:userId" element={<UserDetails />} />
                        <Route path="/admin/users/:userId/reviews" element={<UserReviewsPage />} />
                        <Route path="/admin/users/:userId/comments" element={<UserCommentsPage />} />
                        <Route path="/admin/users/:userId/modify" element={<UserModify />} />
                        <Route path="/admin/reviews/:reviewId/modify" element={<ModifyReview />} />
                        <Route path="/admin/comments/:commentId/modify" element={<ModifyComment />} />
                    </Route>
                    <Route path="/callback" element={<Callback />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/mixtapes" element={<Mixtapes />} />
                    <Route path="/reviews" element={<AllReviews />} />
                    <Route path="/discover" element={<Discover />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/album/:albumId" element={<SingleAlbumDetails />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;