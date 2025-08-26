import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  const { signup } = useAuth();
  const navigate = useNavigate();
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Real-time validation
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'username':
        if (!value.trim()) {
          error = 'Username is required';
        } else if (value.length < 3) {
          error = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = 'Username can only contain letters, numbers, and underscores';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = 'Password must contain uppercase, lowercase, and number';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  // Check form validity
  useEffect(() => {
    const usernameError = validateField('username', formData.username);
    const emailError = validateField('email', formData.email);
    const passwordError = validateField('password', formData.password);
    const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword);
    
    setIsFormValid(
      !usernameError && !emailError && !passwordError && !confirmPasswordError &&
      formData.username && formData.email && formData.password && formData.confirmPassword
    );
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation for touched fields
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }

    // Special case for confirm password when password changes
    if (name === 'password' && touched.confirmPassword) {
      const confirmError = formData.confirmPassword !== value ? 'Passwords do not match' : '';
      setErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    setFocusedField(null);
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const usernameError = validateField('username', formData.username);
    const emailError = validateField('email', formData.email);
    const passwordError = validateField('password', formData.password);
    const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword);
    
    if (usernameError || emailError || passwordError || confirmPasswordError) {
      setErrors({
        username: usernameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError
      });
      setTouched({
        username: true,
        email: true,
        password: true,
        confirmPassword: true
      });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await signup(formData.username, formData.email, formData.password);
      
      if (result.success) {
        setTimeout(() => {
          navigate('/chat');
        }, 300);
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isFormValid && !loading) {
        handleSubmit(e);
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <div className="signup-card">
          {/* Header */}
          <div className="signup-header">
            <div className="brand-logo">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h1 className="brand-name">AetherBot</h1>
            </div>
            <div className="signup-intro">
              <h2 className="welcome-title">Create Account</h2>
              <p className="welcome-subtitle">Join AetherBot and start your AI journey</p>
            </div>
          </div>

          {/* Form */}
          <form className="signup-form" onSubmit={handleSubmit} noValidate>
            {/* Username Field */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <div className={`input-wrapper ${focusedField === 'username' ? 'focused' : ''} ${errors.username ? 'error' : ''} ${formData.username && !errors.username ? 'valid' : ''}`}>
                <div className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <input
                  ref={usernameRef}
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="form-input"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={() => handleFocus('username')}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  autoComplete="username"
                />
                {formData.username && !errors.username && (
                  <div className="validation-icon success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  </div>
                )}
              </div>
              {errors.username && touched.username && (
                <div className="field-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M15 9l-6 6M9 9l6 6"/>
                  </svg>
                  {errors.username}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className={`input-wrapper ${focusedField === 'email' ? 'focused' : ''} ${errors.email ? 'error' : ''} ${formData.email && !errors.email ? 'valid' : ''}`}>
                <div className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <input
                  ref={emailRef}
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="form-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={() => handleFocus('email')}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  autoComplete="email"
                />
                {formData.email && !errors.email && (
                  <div className="validation-icon success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  </div>
                )}
              </div>
              {errors.email && touched.email && (
                <div className="field-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M15 9l-6 6M9 9l6 6"/>
                  </svg>
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className={`input-wrapper ${focusedField === 'password' ? 'focused' : ''} ${errors.password ? 'error' : ''} ${formData.password && !errors.password ? 'valid' : ''}`}>
                <div className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <circle cx="12" cy="16" r="1"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <input
                  ref={passwordRef}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={() => handleFocus('password')}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  tabIndex="-1"
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
                {formData.password && !errors.password && (
                  <div className="validation-icon success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  </div>
                )}
              </div>
              {errors.password && touched.password && (
                <div className="field-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M15 9l-6 6M9 9l6 6"/>
                  </svg>
                  {errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <div className={`input-wrapper ${focusedField === 'confirmPassword' ? 'focused' : ''} ${errors.confirmPassword ? 'error' : ''} ${formData.confirmPassword && !errors.confirmPassword ? 'valid' : ''}`}>
                <div className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <circle cx="12" cy="16" r="1"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <input
                  ref={confirmPasswordRef}
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="form-input"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={() => handleFocus('confirmPassword')}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                  tabIndex="-1"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
                {formData.confirmPassword && !errors.confirmPassword && (
                  <div className="validation-icon success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  </div>
                )}
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <div className="field-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M15 9l-6 6M9 9l6 6"/>
                  </svg>
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="submit-error">
                <div className="error-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M15 9l-6 6M9 9l6 6"/>
                  </svg>
                </div>
                <span>{errors.submit}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`submit-button ${loading ? 'loading' : ''} ${isFormValid ? 'valid' : ''}`}
            >
              <span className="button-content">
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Creating your account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Sign In Link */}
          <div className="signin-section">
            <div className="divider">
              <span>Already have an account?</span>
            </div>
            <Link to="/login" className="signin-button">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
