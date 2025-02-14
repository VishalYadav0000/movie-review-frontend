
const ReviewForm = ({ handleAddReview, newReview, setNewReview }) => {

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card p-3 shadow-sm">
                    <textarea
                        className="form-control"
                        value={newReview}
                        data-gramm="false"
                        onChange={(e) => setNewReview(e.target.value)}
                        placeholder="Write a review..."
                    ></textarea>
                    <button className="btn btn-primary mt-2" onClick={handleAddReview}>
                        Submit Review
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewForm;
