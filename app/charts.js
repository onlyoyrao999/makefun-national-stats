// SVG chart builders. Every chart is drawn as inline SVG from the data,
// with no library and no network request, so it renders the same offline.
import { fmtAxis } from './format.js';

function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// One horizontal bar per row: label on the left, bar, value on the right.
// rows: [{ label, value, key, href? }], key picks the axis formatter.
export function barChart(rows, key, options) {
  const opts = options || {};
  const width = opts.width || 640;
  const rowH = 34;
  const labelW = opts.labelWidth || 110;
  const valueW = 86;
  const max = Math.max(...rows.map((r) => r.value), 1);
  const height = rows.length * rowH + 8;
  const barMax = width - labelW - valueW - 12;
  const palette = ['#1d4ed8', '#0e7490', '#b45309', '#15803d', '#7c3aed', '#be185d'];
  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(opts.title || 'Bar chart')}">`;
  rows.forEach((row, i) => {
    const y = 8 + i * rowH;
    const w = Math.max(2, Math.round((row.value / max) * barMax));
    const color = palette[i % palette.length];
    const label = row.href
      ? `<a href="${esc(row.href)}"><text x="0" y="${y + 15}" class="chart-label chart-link">${esc(row.label)}</text></a>`
      : `<text x="0" y="${y + 15}" class="chart-label">${esc(row.label)}</text>`;
    out += `${label}<rect x="${labelW}" y="${y}" width="${w}" height="20" rx="4" fill="${color}"/>`
      + `<text x="${labelW + w + 8}" y="${y + 15}" class="chart-value">${esc(fmtAxis(key, row.value))}</text>`;
  });
  return out + '</svg>';
}

// Grouped bars: for each country, one bar per indicator key, scaled per
// indicator against the largest value of that indicator in the group.
// Used on the compare page, where unlike units share one chart.
export function groupedBarChart(countries, keys, valueOf, labelOf) {
  const width = 640;
  const groupH = 30;
  const labelW = 110;
  const barMax = width - labelW - 130;
  const height = countries.length * keys.length * groupH + keys.length * 18 + 8;
  const palette = { population: '#1d4ed8', gdp: '#0e7490', gdpPerCapita: '#b45309', life: '#15803d' };
  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Comparison chart">`;
  let y = 8;
  for (const country of countries) {
    out += `<text x="0" y="${y + 14}" class="chart-label chart-group">${esc(country.name)}</text>`;
    y += 22;
    for (const key of keys) {
      const peers = countries.map((c) => valueOf(c, key));
      const max = Math.max(...peers, 1);
      const value = valueOf(country, key);
      const w = Math.max(2, Math.round((value / max) * barMax));
      out += `<text x="12" y="${y + 13}" class="chart-sub">${esc(labelOf(key))}</text>`
        + `<rect x="${labelW}" y="${y}" width="${w}" height="16" rx="3" fill="${palette[key] || '#334155'}"/>`
        + `<text x="${labelW + w + 8}" y="${y + 13}" class="chart-value">${esc(fmtAxis(key, value))}</text>`;
      y += groupH;
    }
    y += 6;
  }
  return out + '</svg>';
}

// A thin "share of the group" strip: each segment is one country's share
// of the group's total for one indicator. Pure SVG, no script needed.
export function shareStrip(rows, key) {
  const total = rows.reduce((sum, r) => sum + r.value, 0) || 1;
  const palette = ['#1d4ed8', '#0e7490', '#b45309', '#15803d', '#7c3aed', '#be185d', '#0369a1', '#b91c1c'];
  let x = 0;
  let out = '<svg viewBox="0 0 640 26" role="img" aria-label="Share of group total">';
  rows.forEach((row, i) => {
    const w = (row.value / total) * 640;
    out += `<rect x="${x.toFixed(1)}" y="0" width="${Math.max(0, w - 1).toFixed(1)}" height="26" rx="3" fill="${palette[i % palette.length]}"><title>${esc(row.label)}: ${((row.value / total) * 100).toFixed(1)}%</title></rect>`;
    x += w;
  });
  return out + '</svg>';
}
