import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setSubmitting(true);
    try {
      const token = await register(email, password);
      if (token) {
        navigate('/notes', { replace: true });
      } else {
        setInfo('Registration successful. Please sign in.');
        setTimeout(() => navigate('/login', { replace: true }), 800);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        'Registration failed. Please try again.';
      setError(String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1 className="title">Create your account</h1>
        <p className="subtitle">Join Ocean Notes and start capturing ideas.</p>

        {error ? <div className="alert error">{error}</div> : null}
        {info ? <div className="alert success">{info}</div> : null}

        <form className="form" onSubmit={onSubmit}>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="input"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="input"
            type="password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <span className="muted">Already have an account?</span>{' '}
          <Link to="/login" className="link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
