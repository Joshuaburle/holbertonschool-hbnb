// part4/scripts/index.js
// Task 2 - Fetch and display places, client-side price filtering, and auth-aware UI

console.log('index.js loaded');

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

// Helper: get stable fake address for a place (SAME LOGIC AS place.js)
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

// Helper: get place description using SAME LOGIC AS place.js
function getPlaceDescription(place) {
  let description = '';
  if (place.description && typeof place.description === 'string' && place.description.trim().length > 0) {
    description = place.description.trim();
  } else {
    description = 'No description provided.';
  }
  return description;
}

// Helper: get place price using SAME LOGIC AS place.js
function getPlacePrice(place) {
  let priceText = 'Price unavailable';
  if (place.price !== undefined && place.price !== null && place.price !== '') {
    const priceNum = Number(place.price);
    if (!Number.isNaN(priceNum) && priceNum > 0) {
      priceText = `Price: $${Math.round(priceNum)}`;
    }
  } else if (place.price_per_night !== undefined && place.price_per_night !== null && place.price_per_night !== '') {
    const priceNum = Number(place.price_per_night);
    if (!Number.isNaN(priceNum) && priceNum > 0) {
      priceText = `Price: $${Math.round(priceNum)}`;
    }
  }
  return priceText;
}

// Helper: get place address using SAME LOGIC AS place.js
function getPlaceAddress(place) {
  let address = place.address || '';
  if (!address || typeof address !== 'string' || address.trim().length === 0) {
    address = getFakeAddress(place.id || '', place.title || 'Place');
  }
  return address;
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
    console.log('index.js: places fetched from listing', places);
    return places;
  } catch (err) {
    console.error('index.js: error fetching places', err);
    return [];
  }
}

// Fetch full details for a single place
async function fetchPlaceDetails(placeId, token) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const url = `${API_BASE_URL}/places/${encodeURIComponent(placeId)}/`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Failed to fetch place details (${res.status})`);
    const place = await res.json();
    console.log(`index.js: fetched details for place ${placeId}`, place);
    return place;
  } catch (err) {
    console.error(`index.js: error fetching place ${placeId}`, err);
    return null;
  }
}

// Fetch full details for all places in parallel
async function fetchAllPlaceDetails(places, token) {
  try {
    const detailPromises = places.map(place => fetchPlaceDetails(place.id, token));
    const detailedPlaces = await Promise.all(detailPromises);
    // Filter out any null responses
    return detailedPlaces.filter(p => p !== null);
  } catch (err) {
    console.error('index.js: error fetching all place details', err);
    return places;
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
    const id = place.id || '';
    const title = place.title || place.name || 'Untitled Place';
    
    // Get description using SAME LOGIC AS place.js
    const description = getPlaceDescription(place);
    
    // Get price using SAME LOGIC AS place.js
    const priceText = getPlacePrice(place);
    
    // Get address using SAME LOGIC AS place.js
    const address = getPlaceAddress(place);

    const card = document.createElement('article');
    card.className = 'place-card';

    // Thumbnail placeholder
    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    thumb.textContent = '🏠';
    card.appendChild(thumb);

    // Card body with content
    const body = document.createElement('div');
    body.className = 'card-body';

    const h = document.createElement('h3');
    h.textContent = title;
    body.appendChild(h);

    // Description paragraph
    const descP = document.createElement('p');
    descP.textContent = description;
    body.appendChild(descP);

    // Price paragraph
    const priceEl = document.createElement('p');
    priceEl.className = 'price';
    priceEl.textContent = priceText;
    body.appendChild(priceEl);

    // Address paragraph
    const locEl = document.createElement('p');
    locEl.className = 'location';
    locEl.textContent = `📍 ${address}`;
    body.appendChild(locEl);

    // Footer with button
    const footer = document.createElement('div');
    footer.className = 'card-footer';
    const details = document.createElement('a');
    details.href = `place.html?id=${encodeURIComponent(id)}`;
    details.textContent = 'View Details';
    details.className = 'details-button';
    footer.appendChild(details);

    card.appendChild(body);
    card.appendChild(footer);
    container.appendChild(card);
  });
}

// Filter places client-side by max price; 'All' shows all
function filterPlacesByPrice(allPlaces, maxPrice) {
  if (!maxPrice || maxPrice === 'All') return allPlaces;
  const num = Number(maxPrice);
  if (Number.isNaN(num)) return allPlaces;
  return allPlaces.filter((p) => {
    const price = p.price !== undefined && p.price !== null ? Number(p.price) : 
                  (p.price_per_night !== undefined && p.price_per_night !== null ? Number(p.price_per_night) : NaN);
    return !Number.isNaN(price) && price > 0 && price <= num;
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

  // Fetch places list first
  const placesList = await fetchPlaces(token);
  
  // Fetch full details for all places in parallel
  const allPlaces = await fetchAllPlaceDetails(placesList, token);
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
