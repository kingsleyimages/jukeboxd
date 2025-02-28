import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

export const handleLogout = (navigate) => {
  // Remove token and user data from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // Redirect to home page
  navigate('/');
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL_PROD ||
    import.meta.env.VITE_API_BASE_URL_DEV;

  // Determine initial mode based on current path
  const [isLoginMode, setIsLoginMode] = useState(
    location.pathname === '/login'
  );

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    confirmPassword: '',
  });

  // Reset form and messages when switching modes
  useEffect(() => {
    setError('');
    setSuccessMessage('');
    setFormData({
      username: '',
      password: '',
      email: '',
      confirmPassword: '',
    });

    // Update mode based on URL path when it changes
    setIsLoginMode(location.pathname === '/login');
  }, [location.pathname]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting login at:', `${API_BASE_URL}/api/users/login`);

      const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
        username: formData.username,
        password: formData.password,
      });

      // Check if response.data contains the expected properties
      if (!response.data.token || !response.data.username) {
        throw new Error('Invalid response from server');
      }

      // Store user data and token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem(
        'user',
        JSON.stringify({ username: response.data.username })
      );

      // Decode the token to get user role
      const decodedToken = JSON.parse(atob(response.data.token.split('.')[1]));
      const userRole = decodedToken.role;

      // Trigger storage event for Navbar to detect login
      window.dispatchEvent(new Event('storage'));

      // Redirect to admin dashboard if user is admin
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        // Redirect to home page
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);

      let errorMessage = 'Login failed. Please check your credentials.';

      if (err.response) {
        errorMessage =
          err.response.data?.message || `Error: ${err.response.data}`;
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!formData.username || !formData.password || !formData.email) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      console.log(
        'Attempting registration at:',
        `${API_BASE_URL}/api/users/register`
      );

      const response = await axios.post(`${API_BASE_URL}/api/users/register`, {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        role: 'user', // Default role for new users
      });

      console.log('Registration response:', response);

      // If successful, navigate to login with success message
      if (response.status === 201 || response.status === 200) {
        navigate('/login', {
          state: { message: 'Registration successful...time to rock & roll!' },
        });
      }
    } catch (err) {
      console.error('Registration error:', err);

      let errorMessage = 'Registration failed. Please try again.';

      if (err.response) {
        errorMessage =
          err.response.data?.message || `Server error: ${err.response.status}`;
        console.log('Error response:', err.response.data);
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your connection.';
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Switch between login and register modes
  const switchMode = () => {
    navigate(isLoginMode ? '/register' : '/login');
  };

  // Check for success message in location state (after registration)
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>{isLoginMode ? 'Welcome back' : 'Create an account'}</h1>
          <p>
            {isLoginMode
              ? 'Log in to access your account'
              : 'Join our community and discover new music'}
          </p>
        </div>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {error && <div className="error-message">{error}</div>}

        <form
          onSubmit={isLoginMode ? handleLogin : handleRegister}
          className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder={
                isLoginMode ? 'Your username' : 'Choose a unique username'
              }
              required
            />
          </div>

          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email address"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={
                isLoginMode ? 'Your password' : 'Create a secure password'
              }
              required
            />
          </div>

          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Verify your password"
                required
              />
            </div>
          )}

          {isLoginMode && (
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>
          )}

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading
              ? isLoginMode
                ? 'Logging in...'
                : 'Creating Account...'
              : isLoginMode
              ? 'Log In'
              : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLoginMode
              ? "Don't have an account? "
              : 'Already have an account? '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                switchMode();
              }}>
              {isLoginMode ? 'Sign up' : 'Log in'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
