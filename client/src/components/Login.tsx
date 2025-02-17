import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Importing the external CSS file for styling
import { login } from './apiLogin';
import { useNavigate } from 'react-router-dom';

// Set up axios default configuration
axios.defaults.withCredentials = true;  // Ensure credentials (like cookies) are included in requests

const Login = () => {
  const[username, setUsername] = useState("");
  const[password, setPassword] = useState("");
  const[error, setError] = useState<string|null>(null)
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const user = await login(username, password);
      console.log("User logged in:", user);
      navigate("/")
    } catch (err:any) {
      setError(err.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
    <h2 className="text-2xl font-bold mb-4">Login</h2>
    {error && <p className="text-red-500">{error}</p>}
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Login
      </button>
    </form>
  </div>
  );

};
export default Login;


// const Login: React.FC = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null); // Reset error message on new submit

//     try {
//       // Send a POST request to the login route
//       const response = await axios.post('http://localhost:3001/auth/login', {
//         username,
//         password,
//       });

//       console.log('Logged in successfully:', response.data);

//       // Handle successful login, e.g., store user data, redirect, etc.
//     } catch (error: any) {
//       setError(error.response?.data?.error || 'Unknown error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

/*   return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default Login;
 */