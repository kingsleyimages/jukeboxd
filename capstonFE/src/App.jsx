import React from 'react';
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
import Admin from './components/Admin'; // Import the Admin component

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<Me />} />
            <Route path="/admin" element={<Admin />} adminOnly /> {/* Add the adminOnly prop */}
          </Route>
          <Route path="/callback" element={<Callback />} />
          <Route path="/home" element={<Home />} />
          <Route path="/mixtapes" element={<Mixtapes />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/album/:albumId" element={<SingleAlbumDetails />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
