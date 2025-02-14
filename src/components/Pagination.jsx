const Pagination = ({ page, setPage, reviewsPerPage, reviews }) => {

    return (
        <div className="d-flex justify-content-center mt-3">
            <button className="btn btn-secondary me-2" onClick={() => setPage(page - 1)} disabled={page === 1}>
                Previous
            </button>
            <span className="align-self-center">Page {page}</span>
            <button
                className="btn btn-secondary ms-2"
                onClick={() => setPage(page + 1)}
                disabled={page * reviewsPerPage >= reviews.length}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
