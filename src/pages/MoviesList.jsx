import React, { useEffect, useState } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
function MoviesList() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const getCurrentUser = () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    console.log(parsedUser.id)
                    setCurrentUser(parsedUser.id || null);
                }
            } catch (error) {
                console.error("Error parsing user from localStorage", error);
                setCurrentUser(null);
            }
        };

        getCurrentUser();
    }, []);

    // Fetch movies from API
    const fetchMovies = async () => {
        console.log(API_BASE_URL)
        try {
            const response = await axios.get(`${API_BASE_URL}/movies`);
            setMovies(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch movies");
            setLoading(false);
        }
    };

    // Handle movie deletion
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/movies/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchMovies();
        } catch (err) {
            console.error("Error deleting movie:", err);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) return <p className="text-danger text-center">{error}</p>;

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Movies List</h2>
            <div className="row row-cols-1 row-cols-md-3 g-3">
                {movies.map((movie) => (
                    <div key={movie._id} className="col">
                        <div className="card h-100 shadow-sm" style={{ maxWidth: "300px", margin: "auto" }}>
                            <img src={movie.poster} alt={movie.title} className="card-img-top" style={{ height: "280px", objectFit: "cover" }} />
                            <div className="card-body p-2 text-center">
                                <p className="fw-bold">Movie Name: {movie.title}</p>
                                <p className="card-text text-truncate small">Description: {movie.description}</p>

                                {currentUser === movie.user && (
                                    <div className="d-flex justify-content-between">
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(movie._id)}>Delete</button>
                                    </div>
                                )}

                                <a href={`/movies/${movie._id}`} className="btn btn-primary btn-sm w-100">View</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MoviesList;
