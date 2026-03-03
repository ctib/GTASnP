/**
 * map.js – Leaflet-Karteninitialisierung, Marker, Popups, Legende
 * v1.0: Kartenansicht mit Gebäude-Markern aus Supabase
 */

import { supabase } from './supabase-client.js';

// ── Leaflet: Image-Pfad auf vendor/ setzen ─────────────────────────
L.Icon.Default.imagePath = 'vendor/images/';

// ── Karte initialisieren ───────────────────────────────────────────
const map = L.map('map').setView([54.3233, 10.1228], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende',
  maxZoom: 19
}).addTo(map);

// ── Legende ────────────────────────────────────────────────────────
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {
  const div = L.DomUtil.create('div', 'map-legend');
  div.innerHTML = `
    <h4>Module</h4>
    <div class="legend-item"><span class="legend-dot gruen"></span> Nachhaltiges Planen (27210)</div>
    <div class="legend-item"><span class="legend-dot blau"></span> Gesch. & Theorie I</div>
  `;
  return div;
};
legend.addTo(map);

// ── Marker-Icons nach Modul ────────────────────────────────────────
const markerIcons = {
  '27210': L.divIcon({
    className: 'marker-icon marker-27210',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  }),
  'GeschTheorie1': L.divIcon({
    className: 'marker-icon marker-sem1',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  })
};

// ── Popup-HTML erzeugen ────────────────────────────────────────────
function createPopupContent(g) {
  const params = [];
  if (g.heizlast_kw != null)      params.push(`<li><strong>Heizlast:</strong> ${g.heizlast_kw} kW</li>`);
  if (g.waermebedarf_mwh != null)  params.push(`<li><strong>Wärmebedarf:</strong> ${g.waermebedarf_mwh} MWh/a</li>`);
  if (g.embodied_carbon != null)   params.push(`<li><strong>Embodied Carbon:</strong> ${g.embodied_carbon} kgCO₂e/m²</li>`);
  if (g.carbon_footprint != null)  params.push(`<li><strong>Carbon Footprint:</strong> ${g.carbon_footprint} tCO₂e/a</li>`);

  const paramList = params.length > 0
    ? `<ul class="popup-params">${params.join('')}</ul>`
    : '';

  const thumbnail = g.thumbnail_url
    ? `<a href="${g.flyer_url}" target="_blank" rel="noopener"><img class="popup-thumbnail" src="${g.thumbnail_url}" alt="Flyer ${g.name}"></a>`
    : '';

  const modulLabel = g.modul === '27210'
    ? 'Nachhaltiges Planen (27210)'
    : 'Gesch. & Theorie I';

  return `
    <div class="popup-content">
      <h3 class="popup-title">${g.name}</h3>
      <p class="popup-address">${g.adresse}${g.baujahr ? ` · ${g.baujahr}` : ''}</p>
      ${g.bewertung_kurz ? `<p class="popup-bewertung">${g.bewertung_kurz}</p>` : ''}
      ${paramList}
      ${thumbnail}
      <p class="popup-meta">${modulLabel} · ${g.semester || ''}</p>
    </div>
  `;
}

// ── Gebäude laden und Marker setzen ────────────────────────────────
async function loadGebaeude() {
  const { data, error } = await supabase
    .from('gebaeude')
    .select('*')
    .eq('status', 'approved');

  if (error) {
    console.error('Fehler beim Laden der Gebäude:', error.message);
    document.getElementById('load-status').textContent =
      'Gebäude konnten nicht geladen werden. Supabase ist noch nicht verbunden.';
    return;
  }

  if (!data || data.length === 0) {
    document.getElementById('load-status').textContent =
      'Noch keine freigegebenen Gebäude vorhanden.';
    return;
  }

  document.getElementById('load-status').textContent = '';

  data.forEach(g => {
    const icon = markerIcons[g.modul] || markerIcons['27210'];
    L.marker([g.lat, g.lng], { icon })
      .addTo(map)
      .bindPopup(createPopupContent(g), { maxWidth: 320 });
  });
}

loadGebaeude();
