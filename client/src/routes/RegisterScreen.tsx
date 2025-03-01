import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import './Login.css';
import { registerUser } from '../api/apiLogin';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error message on new submit

    try {
      await registerUser(username, password);
      navigate('/');
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
                <NavLink to="/" className="text-decoration-none" end>
                  Login
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;