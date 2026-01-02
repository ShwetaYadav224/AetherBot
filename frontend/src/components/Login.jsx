import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const BotIcon = () => (
    <svg viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="10" rx="2"></rect>
        <circle cx="12" cy="5" r="2"></circle>
        <path d="M12 7v4"></path>
        <line x1="8" y1="16" x2="8" y2="16"></line>
        <line x1="16" y1="16" x2="16" y2="16"></line>
    </svg>
);

const UserIcon = () => (
    <svg viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const LockIcon = () => (
    <svg viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

const EyeIcon = () => (
    <svg viewBox="0 0 24 24">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate login for UI demonstration
        setTimeout(() => {
            localStorage.setItem('userEmail', email);
            setLoading(false);
            navigate('/');
        }, 1500);
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-card">
                    <div className="login-header">
                        <div className="brand-logo">
                            <div className="logo-icon">
                                <BotIcon />
                            </div>
                            <h1 className="brand-name">AetherBot</h1>
                        </div>
                        <h2 className="welcome-title">Welcome back</h2>
                        <p className="welcome-subtitle">Please enter your details to sign in</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <UserIcon />
                                </div>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <LockIcon />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <EyeIcon />
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? (
                                <div className="loading-spinner"></div>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <div className="form-footer">
                            <Link to="/forgot-password" title="Forgot Password Link" className="forgot-link">Forgot password?</Link>
                        </div>
                        <div className="signup-section">
                            <div className="divider">
                                <span>Don't have an account?</span>
                            </div>
                            <Link to="/signup" className="signup-button">
                                Sign up for free
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
