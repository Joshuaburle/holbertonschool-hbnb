console.log('add_review.js loaded');

function getCookie(name) {
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  for (const cookie of cookies) {
    const [key, ...valueParts] = cookie.split('=');
    if (key === name) {
      return decodeURIComponent(valueParts.join('='));
    }
  }
  return null;
}

function checkAuthentication() {
  const token = getCookie('token');
  console.log('Token:', token);

  if (!token) {
    window.location.href = 'index.html';
    return null;
  }

  return token;
}

function getPlaceIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function submitReview(token, placeId, comment, rating) {
  const url = `${API_BASE_URL}/reviews/`;
  console.log('POST →', url);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      text: comment,
      rating: Number(rating),
      place_id: placeId
    })
  });

  console.log('Status:', response.status);

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || `Failed to submit review (${response.status})`);
  }

  return await response.json().catch(() => ({}));
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');

  const token = checkAuthentication();
  if (!token) return;

  const placeId = getPlaceIdFromURL();
  console.log('Place ID:', placeId);

  const form = document.getElementById('review-form');
  const message = document.getElementById('message');
  const loginLink = document.querySelector('a.login-button');

  if (loginLink) {
    loginLink.style.display = 'none';
  }

  if (!placeId) {
    if (message) {
      message.textContent = 'Missing place ID';
      message.style.color = 'red';
    }
    return;
  }

  if (!form) {
    console.error('review-form not found');
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const rating = document.getElementById('rating').value;
    const comment = document.getElementById('comment').value.trim();

    if (!comment) {
      message.textContent = 'Comment required';
      message.style.color = 'red';
      return;
    }

    try {
      await submitReview(token, placeId, comment, rating);

      message.textContent = 'Review added successfully!';
      message.style.color = 'green';
      form.reset();

      window.location.href = `place.html?id=${encodeURIComponent(placeId)}`;
    } catch (error) {
      console.error(error);
      message.textContent = `Error: ${error.message}`;
      message.style.color = 'red';
    }
  });
});