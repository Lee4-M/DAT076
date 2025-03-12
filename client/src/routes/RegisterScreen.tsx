import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import './Login.css';
import { registerUser } from '../api/apiLogin';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();

  const isAlphanumeric = (str: string) => {
    return /^[a-z0-9]+$/i.test(str);
  };

  //All characters should be allowed according to OWASP
  //const isAlphanumericPlus = (str: string) => {
  //  return /^[a-z0-9_-]+$/i.test(str);
  //};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null); // Reset error message on new submit

    if (!username || !password) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    if (username.length < 3  || username.length > 128 || password.length < 12 || password.length > 128) {
      setError("Username must be between 3 and 128 characters and password must be between 12 and 128 characters");
      setLoading(false);
      return;
    }

    if (!isAlphanumeric(username)) {
      setError("Username must be alphanumeric");
      setLoading(false);
      return;
    }

    //See explanation in function declaration
    //if (!isAlphanumericPlus(password)) {
    //  setError('Password can only contain a-z, 0-9 and "-_+!#¤%&/()=?"');
    //  setLoading(false);
    //  return;
    //}

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
        {/* Left Side*/}
        <div
          className="col-md-6 d-none d-md-flex left-section"
        >
          <div className="text-center p-5">

          <img
              src="/images/Budgie_Logo.svg" 
              alt="Budgie Logo"
              className="mb-4" 
              style={{ maxWidth: '150px' }} 
            />

            <h1 className="display-4 fw-bold">Create Account</h1>
            <p className="lead">
              Register for Budgie to start budgeting your money. Keep track of your expenses and income.
            </p>
          </div>
        </div>

        {/*Right Side */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="w-75 mx-auto">
            <h2 className="text-center mb-4">Sign Up</h2>
            {error && <div className="error-message">{error}</div>}
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
              <button type="submit" className="btn register-button mb-3">
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