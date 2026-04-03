// part4/scripts/place.js

console.log('place.js loaded');

// Fake readable addresses mapped by place ID (stable across renders)
const FAKE_ADDRESSES = {
  'place-1': '7 Sunflower Street, New York',
  'place-2': '14 Ocean Drive, Miami',
  'place-3': '22 Maple Avenue, Chicago',
  'place-4': '8 Sunset Boulevard, Los Angeles',
  'place-5': '31 Riverside Lane, Boston',
  'place-6': '5 Garden Street, San Francisco',
  'place-7': '18 Palm Avenue, San Diego',
  'place-8': '42 River Road, Seattle'
};

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

// Helper: get stable fake address for a place
function getFakeAddress(placeId, placeName) {
  // Try to find by ID first
  if (FAKE_ADDRESSES[placeId]) {
    return FAKE_ADDRESSES[placeId];
  }
  
  // Generate from place name hash if not found
  const hash = placeName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const streets = ['Sunflower Street', 'Ocean Drive', 'Maple Avenue', 'Sunset Boulevard', 
                   'Riverside Lane', 'Garden Street', 'Palm Avenue', 'River Road'];
  const cities = ['New York', 'Miami', 'Chicago', 'Los Angeles', 'Boston', 'San Francisco', 'San Diego', 'Seattle'];
  const streetNum = (hash % 50) + 1;
  const streetIdx = hash % streets.length;
  const cityIdx = (hash + 1) % cities.length;
  return `${streetNum} ${streets[streetIdx]}, ${cities[cityIdx]}`;
}

// Show / hide add review section and login link
function checkAuthentication() {
  const token = getCookie('token');
  const addReview = document.getElementById('add-review');
  const loginLink = document.querySelector('a.login-button');

  console.log('token:', token);

  if (addReview) {
    addReview.style.display = token ? 'block' : 'none';
  }

  if (loginLink) {
    loginLink.style.display = token ? 'none' : '';
  }

  return token;
}

// Fetch place details
async function fetchPlaceDetails(placeId) {
  if (!placeId) throw new Error('No place ID provided');

  const url = `${API_BASE_URL}/places/${encodeURIComponent(placeId)}/`;
  console.log('Fetching place ID:', placeId);
  console.log('Full URL:', url);

  try {
    const res = await fetch(url, {
      method: 'GET'
    });

    console.log('API Response Status:', res.status);
    console.log('API Response OK:', res.ok);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('API ERROR Response:', errorText);
      throw new Error(`Failed to fetch place (HTTP ${res.status})`);
    }

    const data = await res.json();
    console.log('Place data fetched successfully:', data);
    return data;
  } catch (err) {
    console.error('Fetch error:', err);
    throw err;
  }
}

// Display place details
function displayPlaceDetails(place) {
  const container = document.getElementById('place-details');

  if (!container) return;

  container.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = place.title || 'No title';
  container.appendChild(title);

  // Description with fallback
  const desc = document.createElement('p');
  let description = '';
  if (place.description && typeof place.description === 'string' && place.description.trim().length > 0) {
    description = place.description.trim();
  } else {
    description = 'No description provided.';
  }
  desc.textContent = description;
  container.appendChild(desc);

  // Price with safe fallback
  const price = document.createElement('p');
  let priceText = '💰 Price unavailable';
  if (place.price !== undefined && place.price !== null && place.price !== '') {
    const priceNum = Number(place.price);
    if (!Number.isNaN(priceNum) && priceNum > 0) {
      priceText = `💰 Price: $${Math.round(priceNum)} / night`;
    }
  } else if (place.price_per_night !== undefined && place.price_per_night !== null && place.price_per_night !== '') {
    const priceNum = Number(place.price_per_night);
    if (!Number.isNaN(priceNum) && priceNum > 0) {
      priceText = `💰 Price: $${Math.round(priceNum)} / night`;
    }
  }
  price.textContent = priceText;
  container.appendChild(price);

  // Address: use place.address if exists, otherwise generate stable fake address
  const loc = document.createElement('p');
  let address = place.address || '';
  if (!address || typeof address !== 'string' || address.trim().length === 0) {
    address = getFakeAddress(place.id || '', place.title || 'Place');
  }
  loc.textContent = `📍 Address: ${address}`;
  container.appendChild(loc);

  // Amenities section
  const amenitiesTitle = document.createElement('h3');
  amenitiesTitle.textContent = '✨ Amenities';
  container.appendChild(amenitiesTitle);

  if (place.amenities && place.amenities.length > 0) {
    const amenitiesDiv = document.createElement('div');
    amenitiesDiv.className = 'amenities';
    place.amenities.forEach((a) => {
      const tag = document.createElement('span');
      tag.className = 'amenity';
      // Support both object {name, id} and string forms
      if (typeof a === 'object' && a.name) {
        tag.textContent = a.name;
      } else {
        tag.textContent = a;
      }
      amenitiesDiv.appendChild(tag);
    });
    container.appendChild(amenitiesDiv);
  } else {
    const p = document.createElement('p');
    p.textContent = 'No amenities';
    container.appendChild(p);
  }

  // Reviews section
  const reviewsTitle = document.createElement('h3');
  reviewsTitle.textContent = '⭐ Reviews';
  container.appendChild(reviewsTitle);

  if (place.reviews && place.reviews.length > 0) {
    const reviewsList = document.createElement('div');
    reviewsList.className = 'reviews-list';
    
    place.reviews.forEach((r) => {
      const div = document.createElement('div');
      div.className = 'review-card';

      const user = document.createElement('strong');
      // Use user_email if provided, otherwise show anonymously
      let author = r.user_email || 'Anonymous';
      user.textContent = `👤 ${author}`;
      div.appendChild(user);

      const text = document.createElement('p');
      text.textContent = r.text || r.comment || '(No comment)';
      div.appendChild(text);

      if (r.rating !== undefined && r.rating !== null) {
        const rating = document.createElement('p');
        rating.className = 'rating';
        rating.textContent = `Rating: ${r.rating} / 5`;
        div.appendChild(rating);
      }

      reviewsList.appendChild(div);
    });
    container.appendChild(reviewsList);
  } else {
    const p = document.createElement('p');
    p.textContent = 'No reviews yet';
    container.appendChild(p);
  }
}

// Main
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded');

  const placeId = getPlaceIdFromURL();
  console.log('Place ID:', placeId);

  checkAuthentication();

  const addReviewLink = document.getElementById('add-review-link');
  if (addReviewLink && placeId) {
    addReviewLink.href = `add_review.html?id=${encodeURIComponent(placeId)}`;
  }

  try {
    const place = await fetchPlaceDetails(placeId);
    displayPlaceDetails(place);
  } catch (err) {
    console.error('Error loading place:', err);
    const container = document.getElementById('place-details');
    if (container) {
      container.innerHTML = `
        <div style="color: #d32f2f; padding: 20px; background: #ffebee; border-radius: 8px; border-left: 4px solid #d32f2f;">
          <strong>Error loading place details</strong>
          <p>${err.message || 'Unknown error occurred'}</p>
          <p style="font-size: 12px; color: #999; margin-top: 10px;">Check browser console for details.</p>
        </div>
      `;
    }
  }
});