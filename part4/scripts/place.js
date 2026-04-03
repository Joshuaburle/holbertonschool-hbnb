// part4/scripts/place.js

console.log('place.js loaded');

// Get place ID from URL
function getPlaceIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Get cookie value
function getCookie(name) {
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  for (let i = 0; i < cookies.length; i++) {
    const parts = cookies[i].split('=');
    const key = parts.shift();
    const val = parts.join('=');
    if (key === name) return decodeURIComponent(val);
  }
  return null;
}

// Show / hide add review section
function checkAuthentication() {
  const token = getCookie('token');
  const addReview = document.getElementById('add-review');

  console.log('token:', token);

  if (addReview) {
    if (token) {
      addReview.style.display = 'block';
    } else {
      addReview.style.display = 'none';
    }
  }

  return token;
}

// Fetch place details
async function fetchPlaceDetails(placeId) {
  if (!placeId) throw new Error('No place ID');

  const url = `${API_BASE_URL}/places/${encodeURIComponent(placeId)}/`;
  console.log('Fetching:', url);

  const res = await fetch(url, {
    method: 'GET'
  });

  console.log('Status:', res.status);

  if (!res.ok) {
    throw new Error(`Failed (${res.status})`);
  }

  const data = await res.json();
  console.log('DATA:', data);

  return data;
}

// Display place details
function displayPlaceDetails(place) {
  const container = document.getElementById('place-details');

  if (!container) return;

  container.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = place.title || 'No title';
  container.appendChild(title);

  const desc = document.createElement('p');
  desc.textContent = place.description || 'No description';
  container.appendChild(desc);

  const price = document.createElement('p');
  price.textContent =
    place.price !== undefined && place.price !== null
      ? `Price: $${place.price}`
      : 'Price: N/A';
  container.appendChild(price);

  const loc = document.createElement('p');
  if (place.latitude !== undefined && place.longitude !== undefined) {
    loc.textContent = `Location: ${place.latitude}, ${place.longitude}`;
  } else {
    loc.textContent = 'Location: N/A';
  }
  container.appendChild(loc);

  const amenitiesTitle = document.createElement('h3');
  amenitiesTitle.textContent = 'Amenities';
  container.appendChild(amenitiesTitle);

  if (place.amenities && place.amenities.length > 0) {
    const ul = document.createElement('ul');
    place.amenities.forEach((a) => {
      const li = document.createElement('li');
      li.textContent = a.name || a;
      ul.appendChild(li);
    });
    container.appendChild(ul);
  } else {
    const p = document.createElement('p');
    p.textContent = 'No amenities';
    container.appendChild(p);
  }

  const reviewsTitle = document.createElement('h3');
  reviewsTitle.textContent = 'Reviews';
  container.appendChild(reviewsTitle);

  if (place.reviews && place.reviews.length > 0) {
    place.reviews.forEach((r) => {
      const div = document.createElement('div');
      div.className = 'review-card';

      const user = document.createElement('strong');
      user.textContent = `User: ${r.user_id || 'unknown'}`;
      div.appendChild(user);

      const text = document.createElement('p');
      text.textContent = r.text || '';
      div.appendChild(text);

      const rating = document.createElement('p');
      rating.textContent = r.rating ? `Rating: ${r.rating}` : '';
      div.appendChild(rating);

      container.appendChild(div);
    });
  } else {
    const p = document.createElement('p');
    p.textContent = 'No reviews';
    container.appendChild(p);
  }
}

// Main
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded');

  const placeId = getPlaceIdFromURL();
  console.log('Place ID:', placeId);

  checkAuthentication();

  try {
    const place = await fetchPlaceDetails(placeId);
    displayPlaceDetails(place);
  } catch (err) {
    console.error(err);
    const container = document.getElementById('place-details');
    if (container) {
      container.innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
  }
});