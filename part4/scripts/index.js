document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('places-list');

  try {
    const res = await fetch(`${API_BASE_URL}/places`);
    if (!res.ok) throw new Error('Failed to fetch places');
    const places = await res.json();

    if (!Array.isArray(places) || places.length === 0) {
      container.innerHTML = '<p>No places available.</p>';
      return;
    }

    container.innerHTML = '';
    places.forEach(p => {
      const card = document.createElement('div');
      card.className = 'place-card';

      card.innerHTML = `
        <h3>${escapeHtml(p.title || 'Untitled')}</h3>
        <p>Price: $${p.price}</p>
        <a class="details-button" href="place.html?id=${p.id}">View Details</a>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = `<p style="color: #b00020;">${escapeHtml(err.message)}</p>`;
  }
});

function escapeHtml(str){
  if(!str) return '';
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[s]));
}
