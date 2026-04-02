document.addEventListener('DOMContentLoaded', async () => {
  const id = getQueryParam('id');
  const info = document.getElementById('place-info');
  const reviewsList = document.getElementById('reviews-list');
  const action = document.getElementById('review-action');

  if (!id) {
    info.innerHTML = '<p>Place id missing</p>';
    return;
  }

  try {
    const [placeRes, reviewsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/places/${id}`),
      fetch(`${API_BASE_URL}/reviews`)
    ]);

    if (!placeRes.ok) throw new Error('Failed to fetch place');
    if (!reviewsRes.ok) throw new Error('Failed to fetch reviews');

    const place = await placeRes.json();
    const reviews = await reviewsRes.json();

    // Render place info
    info.innerHTML = `
      <h2>${escapeHtml(place.title || 'Untitled')}</h2>
      <p><strong>Host:</strong> ${escapeHtml(place.owner?.first_name || '')} ${escapeHtml(place.owner?.last_name || '')}</p>
      <p><strong>Price:</strong> $${place.price}</p>
      <p>${escapeHtml(place.description || '')}</p>
      <p><strong>Amenities:</strong> ${place.amenities?.map(a => escapeHtml(a.name)).join(', ') || 'None'}</p>
    `;

    // Render reviews
    const placeReviews = Array.isArray(reviews) ? reviews.filter(r => r.place_id === id) : [];
    if (placeReviews.length === 0) {
      reviewsList.innerHTML = '<p>No reviews yet.</p>';
    } else {
      reviewsList.innerHTML = '';
      placeReviews.forEach(r => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
          <p>${escapeHtml(r.text)}</p>
          <p><strong>User:</strong> ${escapeHtml(r.user_id)}</p>
          <p><strong>Rating:</strong> ${escapeHtml(String(r.rating))}</p>
        `;
        reviewsList.appendChild(card);
      });
    }

    // If authenticated, show button to add review
    if (isAuthenticated()) {
      action.innerHTML = `<a href="add_review.html?place_id=${id}" class="login-button">Add a review</a>`;
    } else {
      action.innerHTML = `<p><a href="login.html">Log in</a> to add a review.</p>`;
    }

  } catch (err) {
    info.innerHTML = `<p style="color: #b00020;">${escapeHtml(err.message)}</p>`;
  }
});

function escapeHtml(str){
  if(!str) return '';
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[s]));
}
