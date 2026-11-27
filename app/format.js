// Small formatting helpers for the statistics shown on the site.
// Every formatter is pure: the same input always renders the same text.

export function fmtInt(n) {
  return Math.round(n).toLocaleString('en-US');
}

export function fmtMoney(n) {
  if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + ' trillion';
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(1) + ' billion';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + ' million';
  return '$' + fmtInt(n);
}

export function fmtMoneyShort(n) {
  if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(0) + 'B';
  return '$' + fmtInt(n);
}

export function fmtPeople(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + ' billion';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + ' million';
  return fmtInt(n);
}

export function fmtYears(n) {
  return n.toFixed(1) + ' years';
}

export function fmtDollars(n) {
  return '$' + fmtInt(n);
}

// Format one indicator value the way its own page shows it.
export function fmtValue(key, value) {
  if (key === 'population') return fmtPeople(value);
  if (key === 'gdp') return fmtMoney(value);
  if (key === 'gdpPerCapita') return fmtDollars(value);
  if (key === 'life') return fmtYears(value);
  return String(value);
}

// Short axis label for a chart bar, e.g. "1.45B", "$28.75T", "84.0".
export function fmtAxis(key, value) {
  if (key === 'population') return (value / 1e9).toFixed(2) + 'B';
  if (key === 'gdp') return '$' + (value / 1e12).toFixed(2) + 'T';
  if (key === 'gdpPerCapita') return '$' + fmtInt(value);
  if (key === 'life') return value.toFixed(1);
  return String(value);
}
