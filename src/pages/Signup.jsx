import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";

function Signup() {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password, role });
            alert("Signup successful! Please log in.");
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
            <div className="card p-4" style={{ width: "400px" }}>
                <h3 className="text-center">Sign Up</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSignup}>
                    <div className="mb-3">
                        <label>Name:</label>
                        <input type="text" className="form-control" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />

                    </div>
                    <div className="mb-3">
                        <label>Email:</label>
                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label>Password:</label>
                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label>Role:</label>
                        <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)} required>
                            <option value="">Select Role</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-success w-100">Sign Up</button>
                </form>
            </div>
        </div>
    );
}

export default Signup;
