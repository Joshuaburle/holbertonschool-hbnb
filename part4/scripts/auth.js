document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorMessage.textContent = '';

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (!data.access_token) {
        throw new Error('No access token returned by API');
      }

        setCookie('token', data.access_token, 1);
        // if API returns user id, store it for client convenience
        if (data.user_id) {
          setCookie('user_id', data.user_id, 1);
        } else if (data.user && data.user.id) {
          setCookie('user_id', data.user.id, 1);
        }
      window.location.href = 'index.html';
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  });
});