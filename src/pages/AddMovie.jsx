import React, { useState } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;


function AddMovieForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [poster, setPoster] = useState("");
    const [preview, setPreview] = useState("");
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    // Convert image to Base64
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setPoster(reader.result); // Convert to Base64
                setPreview(reader.result);
            };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            alert("You must be logged in as an admin to add movies.");
            return;
        }

        if (!title || !description || !poster) {
            setError("All fields are required!");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/movies`, {
                title,
                description,
                poster,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setTitle("");
            setDescription("");
            setPoster("");
            setPreview("");
            setError("");
            setShowSuccess(true);
        } catch (err) {
            console.error("Error adding movie:", err);
            setError("Failed to add movie");
        }
    };
    const handleAddMore = () => {
        setTitle("");
        setDescription("");
        setPoster("");
        setPreview("");
        setShowSuccess(false);
    };
    const goToMovieList = () => {
        window.location.href = "/movies";
    };

    return (
        <div className="container mt-4">
            <h2>Add Movie</h2>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Title:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description:</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Upload Poster:</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                    />
                </div>
                {preview && (
                    <div className="mb-3">
                        <img src={preview} alt="Preview" className="img-thumbnail" style={{ maxWidth: "200px" }} />
                    </div>
                )}
                <button type="submit" className="btn btn-primary">Add Movie</button>
            </form>
            {showSuccess && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-success">Success!</h5>
                                <button type="button" className="btn-close" onClick={() => setShowSuccess(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Movie added successfully! What would you like to do next?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={handleAddMore}>Add More Movies</button>
                                <button className="btn btn-primary" onClick={goToMovieList}>Go to Movie List</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddMovieForm;
