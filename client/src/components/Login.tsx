import React, { useState } from 'react';
import axios from 'axios';
import { login } from './apiLogin';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

axios.defaults.withCredentials = true;  // Ensure credentials (like cookies) are included in requests

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const user = await login(username, password);
      console.log("User logged in:", user);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
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
            <h1 className="display-4 fw-bold">Budgie Boudgeet</h1>
            <p className="lead">
              Track or wack?
            </p>
          </div>
        </div>

        {/* Form Section (Right Side) */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="w-75 mx-auto">
            <h2 className="text-center mb-4">Welcome Back</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleLogin}>
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
                Login
              </button>
              <div className="text-center">
                <span>Don't have an account yet? </span>
                <a href="/register" className="text-decoration-none">
                  Register
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;