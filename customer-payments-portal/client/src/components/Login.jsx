import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import client from '../api';

// Client-side whitelisting (must match server patterns)
const REGEX = {
  username: /^[A-Za-z0-9_]{3,30}$/, 
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}\[\]:;"'<>.,?\/]{8,64}$/
};

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // fetch csrf token to set cookie
    client.get('/api/csrf-token').catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    // sanitize input and validate with whitelist regex
    const rawIdentifier = identifier.trim();
    const safeIdentifier = DOMPurify.sanitize(rawIdentifier, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

    const isEmail = REGEX.email.test(safeIdentifier);
    const isUsername = REGEX.username.test(safeIdentifier);
    if (!isEmail && !isUsername) return setError('Identifier must be a valid username or email');
    if (!REGEX.password.test(password)) return setError('Password does not meet complexity requirements');

    try {
      const payload = isEmail ? { email: safeIdentifier, password } : { username: safeIdentifier, password };
      // include csrf header (double submit) - server expects X-XSRF-TOKEN or x-xsrf-token
      const token = document.cookie.split('; ').find(c => c.startsWith((process.env.REACT_APP_CSRF_COOKIE_NAME || 'csrf_token') + '='));
      const csrf = token ? token.split('=')[1] : '';

      await client.post('/api/auth/login', payload, { headers: { 'X-XSRF-TOKEN': csrf } });
      // on success, redirect or fetch protected resource
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={submit}>
      <label>
        Email or Username
        <input value={identifier} onChange={e => setIdentifier(e.target.value)} required />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </label>
      {error && <div role="alert">{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
}