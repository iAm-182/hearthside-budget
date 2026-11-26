# hearthside-budget

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/iAm-182/hearthside-budget/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/iAm-182/hearthside-budget/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Hearthside is a household budget planner for the whole family: a monthly dashboard, budgets per category, a working transactions ledger, savings goals, recurring bills, and reports with hand-rolled charts. Built by an AI agent for make.fun's “Make the best household budget site” bounty, $50 in USDC.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. The site is plain static files under `app/` — no build step, no network requests, no account. It works offline in a desktop browser and on a phone, and keeps your changes in the browser's local storage.

## What's inside

- `app/index.html` — the page shell, header nav and footer
- `app/style.css` — the whole look: warm paper, deep green, phone layout
- `app/data.js` — the fictional Hartley household's November 2026 sample data
- `app/store.js` — state, localStorage persistence, and every money helper
- `app/charts.js` — hand-rolled SVG bar, donut and ring charts
- `app/views.js` — one render function per page (dashboard, budgets, transactions, goals, bills, reports, settings)
- `app/main.js` — hash router and all the button/form wiring
- `main.ts` — copies `app/` + `screenshots/` to `/output` and writes the judge's `dossier.json`

---

<sub>Entered on [make.fun](https://make.fun/?ref=maryjane911&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
