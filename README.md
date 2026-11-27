# makefun-national-stats

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/onlyoyrao999/makefun-national-stats/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/onlyoyrao999/makefun-national-stats/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

StatAtlas is an original national statistics site: population, GDP, GDP per capita and life expectancy for twelve large economies, each figure with its source and year. It has a searchable, sortable country table, a page per country with its ranks, a compare page for up to three countries, rankings on every indicator, and a sources page explaining the methods. Everything is plain static files under `app/` — no build step, no network request, charts drawn as inline SVG.

Data sources: World Bank, World Development Indicators (CC BY 4.0) — population 2024 (SP.POP.TOTL), GDP in current US$ 2024 (NY.GDP.MKTP.CD), life expectancy at birth 2023 (SP.DYN.LE00.IN). GDP per capita is computed on the page as GDP divided by population.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a browser. To build the hand-in output:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=x2ejakqy&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
