import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Importing the external CSS file for styling

// Set up axios default configuration
axios.defaults.withCredentials = true;  // Ensure credentials (like cookies) are included in requests

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error message on new submit

    try {
      // Send a POST request to the login route
      const response = await axios.post('http://localhost:8080/auth/register', {
        username,
        password,
      });

      console.log('Registered successfully:', response.data);

      // Handle successful register, e.g., store user data, redirect, etc.
    } catch (error: any) {
      setError(error.response?.data?.error || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Gradient Section (Left Side) */}
        <div
          className="col-md-6 d-none d-md-flex align-items-center justify-content-center"
          style={{
            background: '#1F4AA0', 
            color: '#fff',
          }}
        >
          <div className="text-center p-5">
            <h1 className="display-4 fw-bold">Create Account</h1>
            <p className="lead">
              Take take take take take. Register now!
            </p>
          </div>
        </div>

        {/* Form Section (Right Side) */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="w-75 mx-auto">
            <h2 className="text-center mb-4">Sign Up</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 mb-3">
                Register
              </button>
              <div className="text-center mb-3">
                <span>Already have an account? </span>
                <a href="/login" className="text-decoration-none">
                  Login
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
