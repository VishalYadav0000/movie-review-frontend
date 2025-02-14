import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MoviesList from "./pages/MoviesList";
import MovieDetails from "./pages/MovieDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddMovie from "./pages/AddMovie";
import Navbar from "./components/Navbar";

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  return role === "admin" ? children : <Navigate to="/" />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in on page refresh
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="container mt-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MoviesList />} />
          <Route path="/movies/:id" element={<MovieDetails />} />

          {/* Auth Routes (Only Show If Not Logged In) */}
          {!isLoggedIn && (
            <>
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
            </>
          )}

          {/* Admin-Only Routes */}
          <Route path="/add-movie" element={<AdminRoute><AddMovie /></AdminRoute>} />

          {/* Catch-All Route (Redirect to movielist) */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
