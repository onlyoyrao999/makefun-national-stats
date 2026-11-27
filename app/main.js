// StatAtlas bootstrap: hash routing plus the controls each page needs.
// Routes: #/ (home), #/country/<code>, #/compare, #/rankings, #/sources.
// No network request is made anywhere: every page renders from data.js.
import { COUNTRIES, valueOf } from './data.js';
import { fmtValue } from './format.js';
import { compareHtml, renderCompare, renderCountry, renderHome, renderRankings, renderSources } from './views.js';

const page = document.getElementById('page');
const navLinks = [...document.querySelectorAll('[data-route]')];

function route() {
  const hash = location.hash || '#/';
  const parts = hash.replace(/^#\/?/, '').split('/');
  let html;
  let name = 'home';
  if (parts[0] === 'country' && parts[1]) {
    html = renderCountry(parts[1]);
    name = 'country';
  } else if (parts[0] === 'compare') {
    html = renderCompare();
    name = 'compare';
  } else if (parts[0] === 'rankings') {
    html = renderRankings();
    name = 'rankings';
  } else if (parts[0] === 'sources') {
    html = renderSources();
    name = 'sources';
  } else {
    html = renderHome();
  }
  page.innerHTML = html;
  for (const link of navLinks) link.classList.toggle('active', link.dataset.route === name);
  document.title = name === 'home' ? 'StatAtlas — National Statistics Explorer' : `StatAtlas — ${name[0].toUpperCase()}${name.slice(1)}`;
  window.scrollTo(0, 0);
  if (name === 'home') wireHomeTable();
  if (name === 'compare') wireComparePicker();
}

// --- Home table: live search plus clickable column sorting. ---
let sortKey = 'population';
let sortDir = -1;
let query = '';

function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function rowHtml(c) {
  return `<tr><td><a href="#/country/${c.code}">${esc(c.name)}</a></td><td>${esc(c.region)}</td>`
    + `<td class="num">${esc(fmtValue('population', c.population))}</td>`
    + `<td class="num">${esc(fmtValue('gdp', c.gdp))}</td>`
    + `<td class="num">${esc(fmtValue('gdpPerCapita', valueOf(c, 'gdpPerCapita')))}</td>`
    + `<td class="num">${esc(fmtValue('life', c.life))}</td></tr>`;
}

function drawTable() {
  const body = document.querySelector('#country-table tbody');
  if (!body) return;
  const q = query.trim().toLowerCase();
  let rows = COUNTRIES.filter((c) => !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  rows = [...rows].sort((a, b) => {
    if (sortKey === 'name' || sortKey === 'region') {
      return sortDir * a[sortKey].localeCompare(b[sortKey]);
    }
    return sortDir * (valueOf(a, sortKey) - valueOf(b, sortKey));
  });
  body.innerHTML = rows.length
    ? rows.map(rowHtml).join('')
    : '<tr><td colspan="6">No country matches that search. Try another name.</td></tr>';
  for (const th of document.querySelectorAll('#country-table th[data-sort]')) {
    th.classList.toggle('sorted', th.dataset.sort === sortKey);
    th.textContent = th.textContent.replace(/ [▲▼]$/, '');
    if (th.dataset.sort === sortKey) th.textContent += sortDir === 1 ? ' ▲' : ' ▼';
  }
}

function wireHomeTable() {
  const search = document.getElementById('country-search');
  if (search) {
    search.addEventListener('input', () => {
      query = search.value;
      drawTable();
    });
  }
  for (const th of document.querySelectorAll('#country-table th[data-sort]')) {
    th.addEventListener('click', () => {
      if (sortKey === th.dataset.sort) {
        sortDir = -sortDir;
      } else {
        sortKey = th.dataset.sort;
        sortDir = sortKey === 'name' || sortKey === 'region' ? 1 : -1;
      }
      drawTable();
    });
  }
  drawTable();
}

// --- Compare page: up to three checkboxes, table and chart follow. ---
const picked = ['USA', 'CHN', 'IND'];

function wireComparePicker() {
  const box = document.getElementById('compare-picker');
  const result = document.getElementById('compare-result');
  if (!box || !result) return;
  for (const input of box.querySelectorAll('input[type=checkbox]')) {
    input.checked = picked.includes(input.value);
    input.addEventListener('change', () => {
      if (input.checked) {
        if (picked.length >= 3) {
          input.checked = false;
          return;
        }
        picked.push(input.value);
      } else {
        const at = picked.indexOf(input.value);
        if (at !== -1) picked.splice(at, 1);
      }
      result.innerHTML = compareHtml(picked);
    });
  }
  result.innerHTML = compareHtml(picked);
}

window.addEventListener('hashchange', route);
route();
