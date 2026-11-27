// StatAtlas data: twelve large economies, four headline indicators each.
// Every figure below is a published statistic, not an estimate of ours:
//   - Population: World Bank, World Development Indicators, SP.POP.TOTL, 2024.
//   - GDP: World Bank, World Development Indicators, NY.GDP.MKTP.CD,
//     GDP in current US dollars, 2024.
//   - Life expectancy at birth: World Bank, World Development Indicators,
//     SP.DYN.LE00.IN, 2023 (the latest year published for this series).
// GDP per capita is not stored: format.js computes it from the GDP and
// population figures above, so the two series can never disagree.

export const SOURCE_NOTE =
  'World Bank, World Development Indicators (CC BY 4.0). Population 2024, GDP 2024, life expectancy 2023.';

export const COUNTRIES = [
  { code: 'IND', name: 'India', region: 'Asia', population: 1450935791, gdp: 3909892000000, life: 72.0 },
  { code: 'CHN', name: 'China', region: 'Asia', population: 1408975000, gdp: 18743803000000, life: 78.0 },
  { code: 'USA', name: 'United States', region: 'North America', population: 340003797, gdp: 28750956000000, life: 78.4 },
  { code: 'BRA', name: 'Brazil', region: 'South America', population: 211998573, gdp: 2185822000000, life: 75.8 },
  { code: 'MEX', name: 'Mexico', region: 'North America', population: 130861007, gdp: 1856366000000, life: 75.1 },
  { code: 'JPN', name: 'Japan', region: 'Asia', population: 123975371, gdp: 4027598000000, life: 84.0 },
  { code: 'DEU', name: 'Germany', region: 'Europe', population: 83516593, gdp: 4685593000000, life: 80.5 },
  { code: 'GBR', name: 'United Kingdom', region: 'Europe', population: 69281000, gdp: 3686033000000, life: 81.2 },
  { code: 'FRA', name: 'France', region: 'Europe', population: 68551653, gdp: 3160443000000, life: 82.8 },
  { code: 'KOR', name: 'South Korea', region: 'Asia', population: 51751065, gdp: 1875388000000, life: 83.4 },
  { code: 'CAN', name: 'Canada', region: 'North America', population: 41262329, gdp: 2243637000000, life: 81.6 },
  { code: 'AUS', name: 'Australia', region: 'Oceania', population: 27194286, gdp: 1757022000000, life: 83.1 },
];

export const INDICATORS = [
  {
    key: 'population',
    label: 'Population',
    unit: 'people',
    year: 2024,
    series: 'SP.POP.TOTL',
    about: 'Total number of people living in the country, mid-year estimate.',
  },
  {
    key: 'gdp',
    label: 'GDP',
    unit: 'current US$',
    year: 2024,
    series: 'NY.GDP.MKTP.CD',
    about: 'Gross domestic product at current prices, converted to US dollars.',
  },
  {
    key: 'gdpPerCapita',
    label: 'GDP per capita',
    unit: 'current US$',
    year: 2024,
    series: 'NY.GDP.MKTP.CD / SP.POP.TOTL',
    about: 'GDP divided by population, computed from the two series above.',
  },
  {
    key: 'life',
    label: 'Life expectancy',
    unit: 'years',
    year: 2023,
    series: 'SP.DYN.LE00.IN',
    about: 'Years a newborn would live if current mortality patterns stayed the same.',
  },
];

export function findCountry(code) {
  return COUNTRIES.find((c) => c.code === code.toUpperCase());
}

export function valueOf(country, key) {
  if (key === 'gdpPerCapita') return country.gdp / country.population;
  return country[key];
}

// Rank of a country on one indicator, 1 = highest, among the twelve.
export function rankOf(country, key) {
  const sorted = [...COUNTRIES].sort((a, b) => valueOf(b, key) - valueOf(a, key));
  return sorted.findIndex((c) => c.code === country.code) + 1;
}

export function sortedBy(key, limit) {
  const rows = [...COUNTRIES].sort((a, b) => valueOf(b, key) - valueOf(a, key));
  return typeof limit === 'number' ? rows.slice(0, limit) : rows;
}

export function totals() {
  let population = 0;
  let gdp = 0;
  for (const c of COUNTRIES) {
    population += c.population;
    gdp += c.gdp;
  }
  return { population, gdp, count: COUNTRIES.length };
}
