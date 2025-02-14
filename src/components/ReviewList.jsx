
const ReviewList = ({ paginatedReviews, user, handleLike, handleUnlike, handleEditReview, editingReview, setEditingReview, editedText, setEditedText,handleDeleteReview }) => {
    
    return (
        <div className="row justify-content-center mt-3">
            <div className="col-md-6">
                {paginatedReviews.length > 0 ? (
                    paginatedReviews.map((review) => (
                        <div key={review._id} className="card mb-3 shadow-sm">
                            <div className="card-body text-start">

                                <h6 className="fw-bold">{review?.user?.name || "User"}</h6>

                                {editingReview === review._id ? (
                                    <>
                                        <textarea
                                            className="form-control"
                                            value={editedText}
                                            data-gramm="false"
                                            onChange={(e) => setEditedText(e.target.value)}
                                        ></textarea>
                                        <button className="btn btn-success btn-sm mt-2" onClick={() => handleEditReview(review._id)}>
                                            Save
                                        </button>
                                        <button className="btn btn-secondary btn-sm mt-2 ms-2" onClick={() => setEditingReview(null)}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <p className="card-text">{review.text}</p>
                                )}

                                <div className="d-flex align-items-center">
                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => review._id && handleLike(review._id)}>
                                        👍 Like ({review.likes?.length || 0})
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => review._id && handleUnlike(review._id)}>
                                        👎 Unlike
                                    </button>

                                    {/* Check if the logged-in user is the author */}
                                    {user && review.user && review.user._id === user.id && (
                                        <>
                                            <button
                                                className="btn btn-sm btn-warning me-2"
                                                onClick={() => {
                                                    setEditingReview(review._id);
                                                    setEditedText(review.text);
                                                }}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteReview(review._id)}>
                                                🗑️ Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet.</p>
                )}
            </div>
        </div>
    )
};

export default ReviewList;
