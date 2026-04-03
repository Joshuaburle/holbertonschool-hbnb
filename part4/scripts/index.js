// part4/scripts/index.js
// Task 2 - Fetch and display places, client-side price filtering, and auth-aware UI

console.log('index.js loaded');

// Helper: read cookie value by name
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

// Show/hide login link based on token presence
function checkAuthentication() {
  const token = getCookie('token');
  const loginLink = document.getElementById('login-link');
  console.log('index.js: checkAuthentication token=', token);
  console.log('index.js: checkAuthentication loginLink element=', loginLink);
  if (!loginLink) return token;
  if (token) {
    console.log('index.js: token present -> hiding login link');
    loginLink.style.display = 'none';
  } else {
    console.log('index.js: no token -> showing login link');
    loginLink.style.display = '';
  }
  return token;
}

// Fetch places from backend; include Authorization bearer token if present
async function fetchPlaces(token) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/places/`, { headers });
    if (!res.ok) throw new Error(`Failed to fetch places (${res.status})`);
    const places = await res.json();
    console.log('index.js: places fetched', places);
    return places;
  } catch (err) {
    console.error('index.js: error fetching places', err);
    return [];
  }
}

// Render places into container with id 'places-list'
function displayPlaces(places) {
  const container = document.getElementById('places-list');
  if (!container) {
    console.error('index.js: #places-list container not found');
    return;
  }
  container.innerHTML = '';

  if (!places || places.length === 0) {
    container.innerHTML = '<p>No places found.</p>';
    return;
  }

  places.forEach((place) => {
    // Basic fields with safe fallbacks
    const id = place.id || '';
    const title = place.title || place.name || 'Untitled place';
    const description = place.description || place.desc || 'No description available.';
    const price = (place.price !== undefined && place.price !== null) ? place.price : 'N/A';
    const lat = place.latitude || place.lat || null;
    const lon = place.longitude || place.lon || null;

    const card = document.createElement('article');
    card.className = 'place-card';
    card.style.border = '1px solid #ddd';
    card.style.padding = '10px';
    card.style.margin = '10px 0';
    card.style.borderRadius = '8px';

    const h = document.createElement('h3');
    h.textContent = title;
    card.appendChild(h);

    const descP = document.createElement('p');
    descP.textContent = description;
    card.appendChild(descP);

    const priceP = document.createElement('p');
    priceP.textContent = `Price: $${price}`;
    card.appendChild(priceP);

    const locP = document.createElement('p');
    if (lat && lon) {
      locP.textContent = `Location: ${lat}, ${lon}`;
    } else {
      locP.textContent = 'Location: N/A';
    }
    card.appendChild(locP);

    // View Details link uses the real place id
    const details = document.createElement('a');
    details.href = `place.html?id=${encodeURIComponent(id)}`;
    details.textContent = 'View Details';
    details.className = 'details-button';
    card.appendChild(details);

    container.appendChild(card);
  });
}

// Filter places client-side by max price; 'All' shows all
function filterPlacesByPrice(allPlaces, maxPrice) {
  if (!maxPrice || maxPrice === 'All') return allPlaces;
  const num = Number(maxPrice);
  if (Number.isNaN(num)) return allPlaces;
  return allPlaces.filter((p) => {
    const price = Number(p.price);
    return !Number.isNaN(price) && price <= num;
  });
}

// Wire up the page on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
  console.log('index.js: DOMContentLoaded');

  // Price filter dropdown setup
  const filter = document.getElementById('price-filter');
  const filterOptions = ['10', '50', '100', 'All'];
  if (filter) {
    filter.innerHTML = '';
    filterOptions.forEach((opt) => {
      const o = document.createElement('option');
      o.value = opt;
      o.textContent = opt;
      filter.appendChild(o);
    });
  }

  const token = checkAuthentication();

  // Fetch places and render
  const allPlaces = await fetchPlaces(token);
  let currentPlaces = allPlaces.slice();
  displayPlaces(currentPlaces);

  // When filter changes, re-render filtered list
  if (filter) {
    filter.addEventListener('change', (ev) => {
      const val = ev.target.value;
      console.log('index.js: filter changed to', val);
      const filtered = filterPlacesByPrice(allPlaces, val);
      currentPlaces = filtered;
      displayPlaces(currentPlaces);
    });
  }
});
