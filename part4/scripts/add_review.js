document.addEventListener('DOMContentLoaded', () => {
  // Ensure user is authenticated
  redirectIfNotAuthenticated('index.html');

  const placeId = getQueryParam('place_id');
  const form = document.getElementById('add-review-form');
  const errorMessage = document.getElementById('error-message');

  if (!placeId) {
    errorMessage.textContent = 'Missing place id';
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.textContent = '';

    const rating = parseInt(document.getElementById('rating').value, 10);
    const text = document.getElementById('text').value.trim();

    if (!rating || rating < 1 || rating > 5) {
      errorMessage.textContent = 'Rating must be between 1 and 5';
      return;
    }

    if (!text) {
      errorMessage.textContent = 'Comment cannot be empty';
      return;
    }

    const token = getToken();
    const user_id = getCookie('user_id');

    const payload = {
      rating,
      text,
      place_id: placeId
    };

    if (user_id) payload.user_id = user_id;

    try {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: Object.assign(
          { 'Content-Type': 'application/json' },
          token ? { Authorization: `Bearer ${token}` } : {}
        ),
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');

      // Redirect back to place page
      window.location.href = `place.html?id=${placeId}`;
    } catch (err) {
      errorMessage.textContent = err.message;
    }
  });
});
