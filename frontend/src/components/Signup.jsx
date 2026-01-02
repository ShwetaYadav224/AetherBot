import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

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

const MailIcon = () => (
    <svg viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

const LockIcon = () => (
    <svg viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate signup for UI demonstration
        setTimeout(() => {
            setLoading(false);
            navigate('/login');
        }, 1500);
    };

    return (
        <div className="signup-container">
            <div className="signup-wrapper">
                <div className="signup-card">
                    <div className="signup-header">
                        <div className="brand-logo">
                            <div className="logo-icon">
                                <BotIcon />
                            </div>
                            <h1 className="brand-name">AetherBot</h1>
                        </div>
                        <h2 className="welcome-title">Create account</h2>
                        <p className="welcome-subtitle">Start your 14-day free trial today.</p>
                    </div>

                    <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <UserIcon />
                                </div>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <MailIcon />
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
                                    type="password"
                                    className="form-input"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="password-strength">
                                <div className="strength-bar">
                                    <div className={`strength-fill ${password.length > 8 ? 'strong' : password.length > 5 ? 'medium' : 'weak'}`}></div>
                                </div>
                                <p className="strength-text">Must be at least 8 characters.</p>
                            </div>
                        </div>

                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? (
                                <div className="loading-spinner"></div>
                            ) : (
                                "Create account"
                            )}
                        </button>
                    </form>

                    <div className="signin-section">
                        <div className="divider">
                            <span>Already have an account?</span>
                        </div>
                        <Link to="/login" className="signin-button">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
