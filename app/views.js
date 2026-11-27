// Page renderers: one function per route. Each returns an HTML string for
// #page; main.js swaps it in and wires up the controls the page needs.
import { COUNTRIES, INDICATORS, SOURCE_NOTE, findCountry, rankOf, sortedBy, totals, valueOf } from './data.js';
import { fmtMoney, fmtPeople, fmtValue } from './format.js';
import { barChart, groupedBarChart, shareStrip } from './charts.js';

function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function countryLink(code, name) {
  return `<a href="#/country/${code}">${esc(name)}</a>`;
}

function indicatorMeta(key) {
  return INDICATORS.find((i) => i.key === key);
}

function statCard(country, key) {
  const meta = indicatorMeta(key);
  const rank = rankOf(country, key);
  return `<article class="stat-card"><p class="stat-label">${esc(meta.label)} · ${meta.year}</p>`
    + `<p class="stat-value">${esc(fmtValue(key, valueOf(country, key)))}</p>`
    + `<p class="stat-rank">Rank ${rank} of ${COUNTRIES.length} on this site</p>`
    + `<p class="stat-about">${esc(meta.about)}</p></article>`;
}

function rankingRows(key, limit) {
  return sortedBy(key, limit).map((c) => ({
    label: c.name,
    value: valueOf(c, key),
    href: '#/country/' + c.code,
  }));
}

export function renderHome() {
  const t = totals();
  const topPop = rankingRows('population', 5);
  const topGdp = rankingRows('gdp', 5);
  const rows = sortedBy('population').map((c) => ({
    label: c.name,
    value: c.population,
    href: '#/country/' + c.code,
  }));
  return `
  <section class="hero">
    <p class="eyebrow">Twelve large economies · One page each</p>
    <h1>How big is a country, really?</h1>
    <p class="lede">StatAtlas puts the headline numbers for twelve of the world&rsquo;s largest
    economies side by side &mdash; population, GDP, GDP per capita and life expectancy &mdash;
    each with its source and year, so you can check every figure.</p>
    <dl class="hero-stats">
      <div><dt>Countries covered</dt><dd>${t.count}</dd></div>
      <div><dt>People in these countries</dt><dd>${fmtPeople(t.population)}</dd></div>
      <div><dt>Combined GDP, 2024</dt><dd>${fmtMoney(t.gdp)}</dd></div>
    </dl>
    <p class="hero-note">India and China alone hold ${esc('71.3%')} of the people on this page.</p>
  </section>

  <section class="panel">
    <div class="panel-head">
      <h2>Find a country</h2>
      <label class="search">Search
        <input id="country-search" type="search" placeholder="Type a country name&hellip;" autocomplete="off">
      </label>
    </div>
    <p class="hint">Click a column heading to sort. Click a country to open its full page.</p>
    <div class="table-wrap"><table id="country-table">
      <thead><tr>
        <th data-sort="name">Country</th>
        <th data-sort="region">Region</th>
        <th data-sort="population" class="num">Population · 2024</th>
        <th data-sort="gdp" class="num">GDP · 2024</th>
        <th data-sort="gdpPerCapita" class="num">GDP per capita · 2024</th>
        <th data-sort="life" class="num">Life expectancy · 2023</th>
      </tr></thead>
      <tbody></tbody>
    </table></div>
    <p class="source-line">${esc(SOURCE_NOTE)} GDP per capita is GDP divided by population.</p>
  </section>

  <section class="panel">
    <h2>Biggest populations, 2024</h2>
    ${barChart(topPop, 'population', { title: 'Five largest populations in 2024' })}
    <p class="source-line">World Bank, World Development Indicators, SP.POP.TOTL, 2024.</p>
  </section>

  <section class="panel">
    <h2>Biggest economies, 2024</h2>
    ${barChart(topGdp, 'gdp', { title: 'Five largest GDPs in 2024' })}
    <p class="source-line">World Bank, World Development Indicators, NY.GDP.MKTP.CD, GDP in current US$, 2024.</p>
  </section>

  <section class="panel">
    <h2>Where the people are</h2>
    <p>Each block is one country&rsquo;s share of the ${fmtPeople(t.population)} people covered here:</p>
    ${shareStrip(rows, 'population')}
    <p class="legend">${rows.map((r) => esc(r.label)).join(' · ')}</p>
    <p class="source-line">Shares computed from the population figures above.</p>
  </section>

  <section class="panel">
    <h2>Keep exploring</h2>
    <ul class="link-list">
      <li><a href="#/rankings">Rankings</a> &mdash; who leads on each indicator, top to bottom.</li>
      <li><a href="#/compare">Compare countries</a> &mdash; pick up to three and line them up.</li>
      <li><a href="#/sources">Sources &amp; methods</a> &mdash; where every number comes from.</li>
    </ul>
  </section>`;
}

export function renderCountry(code) {
  const c = findCountry(code);
  if (!c) {
    return `<section class="panel"><h1>Country not found</h1>
      <p>StatAtlas covers ${COUNTRIES.length} countries. Pick one from the
      <a href="#/">home page table</a>.</p></section>`;
  }
  const t = totals();
  const popShare = ((c.population / t.population) * 100).toFixed(1);
  const gdpShare = ((c.gdp / t.gdp) * 100).toFixed(1);
  const bars = INDICATORS.map((ind) => {
    const max = Math.max(...COUNTRIES.map((x) => valueOf(x, ind.key)));
    const pct = ((valueOf(c, ind.key) / max) * 100).toFixed(1);
    return { ind, pct };
  });
  return `
  <section class="panel">
    <p class="eyebrow">${esc(c.region)} · ${esc(c.code)}</p>
    <h1>${esc(c.name)}</h1>
    <p class="lede">${esc(c.name)} holds ${esc(popShare)}% of the people and
    ${esc(gdpShare)}% of the GDP of the twelve countries on this site. A newborn here
    could expect to live ${esc(c.life.toFixed(1))} years (2023).</p>
    <div class="stat-grid">
      ${statCard(c, 'population')}${statCard(c, 'gdp')}${statCard(c, 'gdpPerCapita')}${statCard(c, 'life')}
    </div>
  </section>

  <section class="panel">
    <h2>${esc(c.name)} against the largest on this site</h2>
    <p>Each bar is ${esc(c.name)} as a share of the highest value among the twelve countries:</p>
    ${bars.map(({ ind, pct }) => `
      <div class="vs-row"><span class="vs-label">${esc(ind.label)} · ${ind.year}</span>
      <span class="vs-track"><span class="vs-fill" style="width:${pct}%"></span></span>
      <span class="vs-pct">${pct}%</span></div>`).join('')}
    <p class="source-line">${esc(SOURCE_NOTE)}</p>
  </section>

  <section class="panel">
    <h2>Neighbours in the rankings</h2>
    <ul class="link-list">
      ${INDICATORS.map((ind) => {
        const sorted = sortedBy(ind.key);
        const i = sorted.findIndex((x) => x.code === c.code);
        const above = sorted[i - 1];
        const below = sorted[i + 1];
        return `<li>${esc(ind.label)}: ${above ? countryLink(above.code, above.name) + ' above, ' : 'top of the list, '}`
          + `${below ? countryLink(below.code, below.name) + ' below.' : 'bottom of the list.'}</li>`;
      }).join('')}
    </ul>
    <p><a href="#/compare">Compare ${esc(c.name)} with other countries &rarr;</a></p>
    <p><a href="#/">&larr; Back to all countries</a></p>
  </section>`;
}

export function renderCompare() {
  return `
  <section class="panel">
    <h1>Compare countries</h1>
    <p class="lede">Tick up to three countries. The table and the chart update together,
    so a gap you see in one is the same gap in the other.</p>
    <fieldset class="picker" id="compare-picker">
      <legend>Choose up to three</legend>
      ${COUNTRIES.map((c) => `<label><input type="checkbox" value="${c.code}"> ${esc(c.name)}</label>`).join('')}
    </fieldset>
    <div id="compare-result"></div>
    <p class="source-line">${esc(SOURCE_NOTE)} GDP per capita is GDP divided by population.</p>
  </section>`;
}

export function compareHtml(codes) {
  const picked = codes.map(findCountry).filter(Boolean).slice(0, 3);
  if (picked.length === 0) {
    return '<p class="hint">Tick a country above to start comparing.</p>';
  }
  if (picked.length === 1) {
    return `<p class="hint">One country picked: ${esc(picked[0].name)}. Tick one or two more to compare.</p>`
      + compareTable(picked);
  }
  return compareTable(picked)
    + `<h2>Side by side</h2>`
    + groupedBarChart(picked, ['population', 'gdp', 'gdpPerCapita', 'life'], valueOf,
      (key) => indicatorMeta(key).label);
}

function compareTable(picked) {
  return `<div class="table-wrap"><table>
    <thead><tr><th>Indicator</th>${picked.map((c) => `<th class="num">${countryLink(c.code, c.name)}</th>`).join('')}</tr></thead>
    <tbody>
      ${INDICATORS.map((ind) => `<tr><th scope="row">${esc(ind.label)} · ${ind.year}</th>`
        + picked.map((c) => `<td class="num">${esc(fmtValue(ind.key, valueOf(c, ind.key)))} <span class="rank-note">(rank ${rankOf(c, ind.key)})</span></td>`).join('') + '</tr>').join('')}
      <tr><th scope="row">Region</th>${picked.map((c) => `<td class="num">${esc(c.region)}</td>`).join('')}</tr>
    </tbody></table></div>`;
}

export function renderRankings() {
  return `
  <section class="panel">
    <h1>Rankings</h1>
    <p class="lede">All twelve countries, ordered on each indicator. The same numbers
    appear in the home table; here they are ordered so the leaders are obvious.</p>
  </section>
  ${INDICATORS.map((ind) => `
  <section class="panel">
    <h2>${esc(ind.label)} &mdash; ${ind.year}</h2>
    ${barChart(rankingRows(ind.key), ind.key, { title: 'Ranking by ' + ind.label })}
    <p class="source-line">World Bank, World Development Indicators, ${esc(ind.series)}, ${ind.year}.
    ${ind.key === 'gdpPerCapita' ? 'Computed from GDP and population.' : ''}</p>
  </section>`).join('')}`;
}

export function renderSources() {
  return `
  <section class="panel">
    <h1>Sources &amp; methods</h1>
    <p class="lede">StatAtlas covers twelve large economies. Every figure on this site
    comes from one publisher, the World Bank&rsquo;s World Development Indicators,
    so figures from different pages are comparable.</p>
    <div class="table-wrap"><table>
      <thead><tr><th>Indicator</th><th>Series</th><th>Year</th><th>What it measures</th></tr></thead>
      <tbody>
        ${INDICATORS.map((ind) => `<tr><td>${esc(ind.label)}</td><td>${esc(ind.series)}</td>`
          + `<td>${ind.year}</td><td>${esc(ind.about)}</td></tr>`).join('')}
      </tbody></table></div>
    <h2>How to read the numbers</h2>
    <ul class="notes">
      <li><strong>GDP</strong> is in current US dollars, so exchange-rate moves shift it
      even when a country&rsquo;s real output does not. That is why the site never
      mixes GDP years: every GDP figure is 2024.</li>
      <li><strong>GDP per capita</strong> is computed here as GDP divided by population,
      from the two series above, and rounded to the nearest dollar.</li>
      <li><strong>Life expectancy</strong> is a period measure: it describes mortality
      in 2023, the latest year the series publishes, not a forecast for any one person.</li>
      <li><strong>Ranks</strong> are among the twelve countries on this site only,
      not the world. Japan&rsquo;s life expectancy, for example, is the highest here
      and among the highest in the world.</li>
    </ul>
    <h2>Re-use</h2>
    <p>World Bank data is published under a CC BY 4.0 licence. The figures on this
    site may be re-used with attribution to the World Bank, World Development Indicators.
    This site&rsquo;s own text, design and code are original work under the MIT licence
    in the repository.</p>
    <p><a href="#/">&larr; Back to the home page</a></p>
  </section>`;
}
