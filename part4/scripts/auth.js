/*
 * scripts/auth.js
 * Task 1 - Login functionality
 * Uses Fetch API to POST credentials to the backend and store JWT in a cookie.
 */
console.log('auth.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('auth.js: DOMContentLoaded');

  const form = document.getElementById('login-form') || document.querySelector('form');
  const errorElement = document.getElementById('error-message');

  console.log('auth.js: form element ->', form);

  // Lightweight fallback for setCookie if utils.js wasn't loaded
  function setCookie(name, value, days = 1) {
    const maxAge = days ? days * 24 * 60 * 60 : 0;
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}`;
  }

  if (!form) {
    console.error('auth.js: No form found on page. Aborting attach.');
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('auth.js: submit triggered');

    if (errorElement) errorElement.textContent = '';

    const emailEl = form.querySelector('#email') || form.querySelector('input[name="email"]');
    const passwordEl = form.querySelector('#password') || form.querySelector('input[name="password"]');

    const email = emailEl ? emailEl.value.trim() : '';
    const password = passwordEl ? passwordEl.value.trim() : '';

    if (!email || !password) {
      const msg = 'Please provide both email and password.';
      console.warn('auth.js:', msg);
      if (errorElement) errorElement.textContent = msg;
      return;
    }

    try {
      const url = `${API_BASE_URL}/auth/login`;
      console.log('auth.js: sending request to', url);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      console.log('auth.js: response status', res.status);
      const data = await res.json().catch(() => ({}));
      console.log('auth.js: response body', data);

      if (!res.ok) {
        const msg = data && (data.message || data.error) ? (data.message || data.error) : `Login failed (${res.status})`;
        throw new Error(msg);
      }

      const token = data && data.access_token;
      if (!token) throw new Error('Authentication succeeded but no token was returned.');

      // Store token in cookie for session management
      setCookie('token', token, 1); // 1 day expiry
      console.log('auth.js: token stored in cookie');

      // Redirect to index.html
      console.log('auth.js: redirecting to index.html');
      window.location.href = 'index.html';
    } catch (err) {
      console.error('auth.js: login error', err);
      if (errorElement) {
        errorElement.textContent = err.message || 'An error occurred during login.';
      }
    }
  });
});