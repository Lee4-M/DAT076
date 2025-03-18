import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { login } from '../api/apiLogin';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        if (!username || !password) {
            setError("Please enter username and password");
            return;
        }

        try {
            await login(username, password);
            navigate("/budget");
        } catch {
            setError("Wrong username or password");
        }
    };

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                {/* Banner on left side */}
                <div className="col-md-6 d-none d-md-flex left-section">
                    <header className="text-center p-5">
                        <img
                            src="/images/Budgie_Logo.svg"
                            alt="Budgie Logo"
                            className="mb-4"
                            style={{ maxWidth: '150px' }}
                        />
                        <h1 className="display-4 fw-bold">Budgie</h1>
                        <p className="lead">
                            Budget your money with Budgie. Keep track of your expenses and
                            income.
                        </p>
                    </header>
                </div>

                {/* Form Section on right side */}
                <main className="col-md-6 d-flex align-items-center justify-content-center">
                    <div className="w-75 mx-auto">
                        <h2 className="text-center mb-4">Welcome to Budgie</h2>
                        {error && <div className="error-message">{error}</div>}
                        <form onSubmit={handleLogin} >
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
                            <button type="submit" className="btn login-button mb-3">
                                Log In
                            </button>
                            <div className="text-center">
                                <span>Don't have an account yet? </span>
                                <NavLink to="/register" className="text-decoration-none" end>
                                    Register
                                </NavLink>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Login;