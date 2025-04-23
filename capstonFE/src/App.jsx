import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import Discover from "./components/Discover";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Me from "./components/Me";
import Home from "./components/Home";
import Mixtapes from "./components/Mixtapes";
import Register from "./components/Register";
import Login from "./components/Login";
import Callback from "./components/Callback";
import AllReviews from "./components/AllReviews";
import SingleAlbumDetails from "./components/SingleAlbumDetails";
import Results from "./components/Results";
import Admin from "./components/admin-components/Admin";
import InactivityLogoutTimer from "./components/InactivtyLogoutTimer";
import NavbarRedux from "./components/NavbarRedux";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <InactivityLogoutTimer />
        {/* <Navbar /> */}
        <NavbarRedux />
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<Me />} />
            <Route path="/admin/*" element={<Admin />} /> {/* Admin routes */}
          </Route>
          <Route path="/callback" element={<Callback />} />
          <Route path="/" element={<Home />} />
          <Route path="/mixtapes" element={<Mixtapes />} />
          <Route path="/reviews" element={<AllReviews />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/results/:searchInput" element={<Results />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/album/:albumId" element={<SingleAlbumDetails />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
