import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import Pagination from "../components/Pagination";

function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState("");
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [editingReview, setEditingReview] = useState(null);
    const [editedText, setEditedText] = useState("");
    const [sortBy, setSortBy] = useState("recent");
    const reviewsPerPage = 5;
    const user = JSON.parse(localStorage.getItem("user"));
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;


    useEffect(() => {
        fetchMovieDetails();
        fetchReviews();
    }, [sortBy]);

    const fetchMovieDetails = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/movies/${id}`);
            setMovie(response.data);
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/reviews/${id}`);
            let sortedReviews = response.data;

            if (sortBy === "popular") {
                console.log("popular")
                sortedReviews.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
            } else {
                sortedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }

            setReviews(sortedReviews);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };
    const handleAddReview = async () => {
        if (!newReview.trim()) return;
        try {
            const token = localStorage.getItem("token");

            await axios.post(
                `${API_BASE_URL}/reviews/${id}`,
                { text: newReview, name: user?.name },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNewReview("");
            fetchReviews();
        } catch (error) {
            setError(error.response?.data?.message || "Failed to add review");
        }
    };

    const handleEditReview = async (reviewId) => {
        if (!editedText.trim()) return;

        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `${API_BASE_URL}/reviews/${reviewId}`,
                { text: editedText },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setEditingReview(null);
            setEditedText("");
            fetchReviews();
        } catch (error) {
            console.error("Error editing review:", error);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            const token = localStorage.getItem("token");

            await axios.delete(`${API_BASE_URL}/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            fetchReviews();
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    const handleLike = async (reviewId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${API_BASE_URL}/reviews/like/${reviewId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(reviewId, response.data)

            setReviews(reviews.map(review =>
                review._id === reviewId ? response.data : review
            ));
        } catch (error) {
            console.error("Error liking review:", error);
        }
    };

    const handleUnlike = async (reviewId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${API_BASE_URL}/reviews/unlike/${reviewId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setReviews(reviews.map(review =>
                review._id === reviewId ? response.data : review
            ));
        } catch (error) {
            console.error("Error unliking review:", error);
        }
    };

    const paginatedReviews = reviews.slice((page - 1) * reviewsPerPage, page * reviewsPerPage);

    return (
        <div className="container mt-4 text-center">
            {movie ? (
                <>
                    <h2 className="mb-3">{movie.title}</h2>
                    <img src={movie.poster} alt={movie.title} className="img-fluid mb-3 rounded shadow" style={{ maxWidth: "300px" }} />
                    <p className="lead">{movie.description}</p>
                    <h3 className="mt-4">Reviews</h3>
                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="d-flex justify-content-center mb-3">
                        <select className="form-select w-auto" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="recent">Most Recent</option>
                            <option value="popular">Most Liked</option>
                        </select>
                    </div>
                    {user ? (
                        <ReviewForm
                            handleAddReview={handleAddReview}
                            newReview={newReview}
                            setNewReview={setNewReview}
                        />
                    ) : (
                        <p className="text-center text-danger">Please <a href="/login">login</a> to give a review.</p>
                    )}
                    <ReviewList
                        paginatedReviews={paginatedReviews}
                        editingReview={editingReview}
                        setEditingReview={setEditingReview}
                        editedText={editedText}
                        setEditedText={setEditedText}
                        user={user}
                        handleLike={handleLike}
                        handleUnlike={handleUnlike}
                        handleEditReview={handleEditReview}
                        handleDeleteReview={handleDeleteReview}
                    />

                    <Pagination
                        page={page}
                        reviews={reviews}
                        setPage={setPage}
                        reviewsPerPage={reviewsPerPage}
                    />

                </>
            ) : (
                <p>Loading movie details...</p>
            )}
        </div>
    );
}

export default MovieDetails;
