import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import Discover from "./components/Discover";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Me from "./components/Me";
import Home from "./components/Home";
import Mixtapes from "./components/Mixtapes";
import Search from "./components/Search";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_API_BASE_URL}`)
			.then((data) => console.log(data))
			.catch((err) => console.log(err));
	}, []);
	return (
		<>
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route element={<ProtectedRoute />}>
						<Route path="/account" element={<Me />} />
					</Route>
					{/* <Route path="/callback" element={<Callback />} /> */} //
					necesssary for authentication
					<Route path="/home" element={<Home />} />
					<Route path="/mixtapes" element={<Mixtapes />} />
					<Route path="/discover" element={<Discover />} />
					<Route path="/search" element={<Search />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
