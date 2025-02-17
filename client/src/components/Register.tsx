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
    <div className="login-container">
      <div className="login-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default Register;
