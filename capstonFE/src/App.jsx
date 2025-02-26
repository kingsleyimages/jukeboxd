import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Discover from './components/Discover';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Me from './components/Me';
import Home from './components/Home';
import Mixtapes from './components/Mixtapes';
import Search from './components/Search';
import Register from './components/Register';
import Login from './components/Login';
import Callback from './components/Callback';
import SingleAlbumDetails from './components/SingleAlbumDetails';
import AdminDashboard from './components/home-components/AdminDashBoard'; 
import ViewAllUsers from './components/admin-components/ViewAllUsers';

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    console.log("App loaded, userId:", token);
  }, []);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<Me />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/dashboard/users" element={<ViewAllUsers />}/>
          </Route>
          <Route path="/callback" element={<Callback />} />
          <Route path="/" element={<Home />} />
          <Route path="/mixtapes" element={<Mixtapes />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/album/:albumId"
            element={<SingleAlbumDetails token={token} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
