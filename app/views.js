// Hearthside views — one render function per page. Pages are plain HTML
// strings; main.js wires the buttons and forms after each render.
import { state, money, money0, catById, income, spentByCategory, totalSpent, totalBudgeted, exportJSON } from "./store.js";
import { monthBars, donut, progressBar, savingsRing, esc } from "./charts.js";

export const viewState = { month: "2026-11", txCategory: "all", txSearch: "", editingTx: null };

const ICONS = {
  home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  cart: '<path d="M3 4h2l2.4 12.2A2 2 0 0 0 9.4 18h8.4a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="10" cy="21" r="1.6"/><circle cx="18" cy="21" r="1.6"/>',
  bolt: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>',
  car: '<path d="M5 12l1.5-4.5A2 2 0 0 1 8.4 6h7.2a2 2 0 0 1 1.9 1.5L19 12v6h-2v-2H7v2H5z"/><circle cx="8" cy="16" r="1.8"/><circle cx="16" cy="16" r="1.8"/>',
  fork: '<path d="M7 2v7a2 2 0 0 0 2 2v11M7 2v4M11 2v4M9 2v20" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M17 2c-1.5 1.5-2 4-2 6 0 2 1 3 2 3v11" stroke="currentColor" stroke-width="1.8" fill="none"/>',
  ticket: '<path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4z"/><path d="M14 6v2M14 11v2M14 16v2" stroke="#faf7f0" stroke-width="1.8"/>',
  cross: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
  book: '<path d="M4 4a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M19 18H6a2 2 0 0 0-2 2" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  shirt: '<path d="M8 3L3 7l2 4 2-1v11h10V10l2 1 2-4-5-4a3 3 0 0 1-6 0z"/>',
  piggy: '<path d="M12 3a9 9 0 1 0 9 9h-2.5l1.5-3-1.8-.6L20 5.5A9 9 0 0 0 12 3zm-1 4v2h2V7z" />',
  dots: '<circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>',
};

export function icon(name, cls = "") {
  return `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${ICONS[name] ?? ICONS.dots}</svg>`;
}

function monthLabel(m) {
  const [y, mo] = m.split("-");
  return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][Number(mo) - 1] + " " + y;
}

function monthSwitcher() {
  const cur = viewState.month;
  return `<div class="month-switch" role="group" aria-label="Choose month">
    <button data-action="set-month" data-month="2026-10" class="${cur === "2026-10" ? "active" : ""}">October 2026</button>
    <button data-action="set-month" data-month="2026-11" class="${cur === "2026-11" ? "active" : ""}">November 2026</button>
  </div>`;
}

function spentFor(month) {
  if (month === state.lastMonth.month) return { ...state.lastMonth.spentByCategory };
  return spentByCategory(month);
}

function incomeFor(month) {
  if (month === state.lastMonth.month) return state.lastMonth.income;
  return income(month);
}

function navLink(hash, label) {
  return `<a href="${hash}">${label}</a>`;
}

export function renderDashboard() {
  const m = viewState.month;
  const inc = incomeFor(m);
  const spent = spentFor(m);
  const total = Object.values(spent).reduce((a, b) => a + b, 0);
  const left = inc - total;
  const saved = spent.savings ?? 0;
  const top = [...state.categories]
    .map((c) => ({ ...c, spent: spent[c.id] ?? 0 }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);
  const upcoming = state.bills.filter((b) => !b.paid).sort((a, b) => a.dueDay - b.dueDay).slice(0, 3);
  const recent = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);

  return `
  <section class="page-head">
    <div><p class="eyebrow">${esc(state.household.name)} · ${monthLabel(m)}</p>
    <h1>Every dollar has a room.</h1>
    <p class="lede">Income, spending, bills and savings for the whole household — in one place, up to date through 26 November.</p></div>
    ${monthSwitcher()}
  </section>

  <section class="stats" aria-label="Month summary">
    <div class="stat"><span class="stat-label">Income</span><strong>${money(inc)}</strong><span class="stat-sub">Maya ${money0(4200)} · Jordan ${money0(2650)}</span></div>
    <div class="stat"><span class="stat-label">Spent so far</span><strong>${money(total)}</strong><span class="stat-sub">${money0(left)} left to spend</span></div>
    <div class="stat"><span class="stat-label">Budgeted</span><strong>${money(totalBudgeted())}</strong><span class="stat-sub">across ${state.categories.length} categories</span></div>
    <div class="stat ring-stat">${savingsRing(saved, inc)}<span class="stat-sub">of income went to savings</span></div>
  </section>

  <div class="grid-2">
    <section class="card">
      <div class="card-head"><h2>Where the money went</h2>${navLink("#/budget", "All budgets →")}</div>
      ${top.map((c) => `<div class="cat-row">
          <span class="cat-ic" style="color:${c.color}">${icon(c.icon)}</span>
          <div class="cat-body"><div class="cat-line"><span>${esc(c.name)}</span><span>${money(c.spent)} of ${money0(c.budget)}</span></div>
          ${progressBar(c.spent, c.budget, c.color)}</div>
        </div>`).join("")}
    </section>

    <section class="card">
      <div class="card-head"><h2>Coming up</h2>${navLink("#/bills", "All bills →")}</div>
      ${upcoming.length ? upcoming.map((b) => `<div class="bill-line"><span>${esc(b.name)}</span><span><strong>${money(b.amount)}</strong> · due ${b.dueDay} Nov</span></div>`).join("") : `<p class="muted">Every bill for ${monthLabel(m)} is paid. Nicely done.</p>`}
      <div class="card-head" style="margin-top:1.2rem"><h2>Savings goals</h2>${navLink("#/goals", "All goals →")}</div>
      ${state.goals.slice(0, 2).map((g) => `<div class="goal-mini"><div class="cat-line"><span>${esc(g.name)}</span><span>${money0(g.saved)} / ${money0(g.target)}</span></div>${progressBar(g.saved, g.target, "#234636")}</div>`).join("")}
    </section>
  </div>

  <section class="card">
    <div class="card-head"><h2>Recent transactions</h2>${navLink("#/transactions", "All transactions →")}</div>
    <table class="tx"><tbody>
      ${recent.map((t) => `<tr><td>${t.date.slice(5)}</td><td>${esc(t.desc)}</td><td><span class="pill" style="--c:${catById(t.category).color}">${esc(catById(t.category).name)}</span></td><td class="num ${t.type === "income" ? "in" : ""}">${t.type === "income" ? "+" : "−"}${money(t.amount)}</td></tr>`).join("")}
    </tbody></table>
  </section>`;
}

export function renderBudget() {
  const m = viewState.month;
  const spent = spentFor(m);
  const rows = state.categories.map((c) => {
    const s = spent[c.id] ?? 0;
    const rem = c.budget - s;
    return `<tr>
      <td><span class="cat-ic" style="color:${c.color}">${icon(c.icon)}</span> ${esc(c.name)}</td>
      <td class="num"><form data-form="budget" data-id="${c.id}"><label class="sr" for="b-${c.id}">Monthly budget for ${esc(c.name)}</label><input id="b-${c.id}" name="amount" type="number" min="0" step="1" value="${c.budget}" class="money-input"> <button class="btn small" type="submit">Save</button></form></td>
      <td class="num">${money(s)}</td>
      <td class="num ${rem < 0 ? "over-txt" : ""}">${rem < 0 ? "−" : ""}${money(Math.abs(rem))}${rem < 0 ? " over" : " left"}</td>
      <td class="bar-cell">${progressBar(s, c.budget, c.color)}<span class="pct">${c.budget ? Math.round((s / c.budget) * 100) : 0}%</span></td>
    </tr>`;
  }).join("");
  const total = Object.values(spent).reduce((a, b) => a + b, 0);

  return `
  <section class="page-head"><div><p class="eyebrow">Budgets · ${monthLabel(m)}</p>
  <h1>Give every dollar a job.</h1>
  <p class="lede">Set a monthly limit per category, then watch the bars fill as spending lands. Change a budget any time — the totals update everywhere.</p></div>
  ${monthSwitcher()}</section>

  <section class="card"><table class="budget-table">
    <thead><tr><th>Category</th><th>Monthly budget</th><th>Spent</th><th>Remaining</th><th>Progress</th></tr></thead>
    <tbody>${rows}</tbody>
    <tfoot><tr><td>Total</td><td class="num">${money(totalBudgeted())}</td><td class="num">${money(total)}</td><td class="num">${money(totalBudgeted() - total)}</td><td></td></tr></tfoot>
  </table></section>

  <section class="card"><h2>Add a category</h2>
    <form data-form="add-category" class="inline-form">
      <label>Category name <input name="name" type="text" required maxlength="40" placeholder="e.g. Pets"></label>
      <label>Monthly budget <input name="amount" type="number" min="0" step="1" value="100" class="money-input"></label>
      <button class="btn" type="submit">Add category</button>
    </form>
    <p class="muted">New categories appear in the budget table, the transaction form and the reports at once.</p>
  </section>`;
}

export function renderTransactions() {
  const f = viewState;
  const cats = state.categories;
  let list = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1));
  if (f.txCategory !== "all") list = list.filter((t) => t.category === f.txCategory || (f.txCategory === "income" && t.type === "income"));
  if (f.txSearch.trim()) {
    const q = f.txSearch.trim().toLowerCase();
    list = list.filter((t) => t.desc.toLowerCase().includes(q));
  }
  const editing = f.editingTx ? state.transactions.find((t) => t.id === f.editingTx) : null;
  const totalOut = list.filter((t) => t.type !== "income").reduce((s, t) => s + t.amount, 0);
  const totalIn = list.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);

  return `
  <section class="page-head"><div><p class="eyebrow">Transactions · November 2026</p>
  <h1>Every cent, accounted for.</h1>
  <p class="lede">${state.transactions.length} transactions this month. Add one, fix a typo, or delete a duplicate — the dashboard and reports update instantly.</p></div></section>

  <section class="card"><h2>${editing ? "Edit transaction" : "Add a transaction"}</h2>
    <form data-form="transaction" class="tx-form">
      <input type="hidden" name="id" value="${editing ? editing.id : ""}">
      <label>Date <input name="date" type="date" required value="${editing ? editing.date : "2026-11-26"}"></label>
      <label>Description <input name="desc" type="text" required maxlength="80" placeholder="What was it?" value="${editing ? esc(editing.desc) : ""}"></label>
      <label>Category <select name="category">${cats.map((c) => `<option value="${c.id}" ${editing && editing.category === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("")}<option value="income" ${editing && editing.type === "income" ? "selected" : ""}>Income</option></select></label>
      <label>Amount <input name="amount" type="number" min="0.01" step="0.01" required value="${editing ? editing.amount : ""}" placeholder="0.00"></label>
      <button class="btn" type="submit">${editing ? "Save changes" : "Add transaction"}</button>
      ${editing ? `<button class="btn ghost" type="button" data-action="cancel-edit">Cancel</button>` : ""}
    </form>
  </section>

  <section class="card">
    <div class="filter-row">
      <label>Category <select data-filter="category">${`<option value="all">All categories</option>`}${cats.map((c) => `<option value="${c.id}" ${f.txCategory === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("")}<option value="income" ${f.txCategory === "income" ? "selected" : ""}>Income</option></select></label>
      <label>Search <input type="search" data-filter="search" placeholder="Search descriptions…" value="${esc(f.txSearch)}"></label>
      <span class="filter-total">Showing ${list.length} · in ${money(totalIn)} · out ${money(totalOut)}</span>
    </div>
    ${list.length ? `<table class="tx"><thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th></th></tr></thead><tbody>
      ${list.map((t) => `<tr><td>${t.date}</td><td>${esc(t.desc)}</td><td><span class="pill" style="--c:${catById(t.category).color}">${t.type === "income" ? "Income" : esc(catById(t.category).name)}</span></td><td class="num ${t.type === "income" ? "in" : ""}">${t.type === "income" ? "+" : "−"}${money(t.amount)}</td>
      <td class="row-actions"><button class="btn small ghost" data-action="edit-tx" data-id="${t.id}">Edit</button> <button class="btn small danger" data-action="delete-tx" data-id="${t.id}">Delete</button></td></tr>`).join("")}
    </tbody></table>` : `<p class="muted">No transactions match that filter. Try clearing the search.</p>`}
  </section>`;
}

export function renderGoals() {
  return `
  <section class="page-head"><div><p class="eyebrow">Savings goals</p>
  <h1>Something to look forward to.</h1>
  <p class="lede">Four goals, one household. Add money whenever there is spare cash — the progress bars and the dashboard follow along.</p></div></section>
  <div class="grid-2">
  ${state.goals.map((g) => {
    const pct = g.target ? Math.round((g.saved / g.target) * 100) : 0;
    const done = g.saved >= g.target;
    return `<section class="card goal-card">
      <div class="card-head"><h2>${esc(g.name)}</h2><span class="goal-pct">${pct}%</span></div>
      <p class="muted">${esc(g.note)}</p>
      ${progressBar(g.saved, g.target, "#234636")}
      <p class="goal-nums"><strong>${money(g.saved)}</strong> saved of ${money(g.target)} · ${money(g.target - g.saved)} to go</p>
      ${done ? `<p class="goal-done">Goal reached — time to celebrate, then set the next one.</p>` : `
      <form data-form="add-funds" data-id="${g.id}" class="inline-form">
        <label>Add funds <input name="amount" type="number" min="1" step="1" required placeholder="Amount" class="money-input"></label>
        <button class="btn" type="submit">Add to goal</button>
      </form>`}
    </section>`;
  }).join("")}
  </div>
  <section class="card"><h2>Start a new goal</h2>
    <form data-form="add-goal" class="inline-form">
      <label>Goal name <input name="name" type="text" required maxlength="60" placeholder="e.g. New sofa"></label>
      <label>Target amount <input name="amount" type="number" min="1" step="1" required value="1000" class="money-input"></label>
      <button class="btn" type="submit">Create goal</button>
    </form>
  </section>`;
}

export function renderBills() {
  const sorted = [...state.bills].sort((a, b) => a.dueDay - b.dueDay);
  const monthly = sorted.reduce((s, b) => s + b.amount, 0);
  const unpaid = sorted.filter((b) => !b.paid);
  const unpaidTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  return `
  <section class="page-head"><div><p class="eyebrow">Bills &amp; recurring</p>
  <h1>Nothing slips through.</h1>
  <p class="lede">${money(monthly)} leaves the household every month on autopilot. Tick a bill off as soon as it is paid — the dashboard's "coming up" list updates too.</p></div></section>
  <section class="stats">
    <div class="stat"><span class="stat-label">Monthly recurring total</span><strong>${money(monthly)}</strong><span class="stat-sub">${sorted.length} bills</span></div>
    <div class="stat"><span class="stat-label">Still to pay in November</span><strong>${money(unpaidTotal)}</strong><span class="stat-sub">${unpaid.length} bill${unpaid.length === 1 ? "" : "s"} left</span></div>
    <div class="stat"><span class="stat-label">Paid this month</span><strong>${money(monthly - unpaidTotal)}</strong><span class="stat-sub">${sorted.length - unpaid.length} of ${sorted.length} settled</span></div>
  </section>
  <section class="card"><table class="tx"><thead><tr><th>Due</th><th>Bill</th><th>Category</th><th>Amount</th><th>Status</th></tr></thead><tbody>
    ${sorted.map((b) => `<tr class="${b.paid ? "paid-row" : ""}"><td>${b.dueDay} Nov</td><td>${esc(b.name)}</td><td><span class="pill" style="--c:${catById(b.category).color}">${esc(catById(b.category).name)}</span></td><td class="num">${money(b.amount)}</td>
    <td><button class="btn small ${b.paid ? "ghost" : ""}" data-action="toggle-bill" data-id="${b.id}">${b.paid ? "Paid ✓ — undo" : "Mark paid"}</button></td></tr>`).join("")}
  </tbody></table></section>
  <section class="card"><h2>Add a recurring bill</h2>
    <form data-form="add-bill" class="inline-form">
      <label>Bill name <input name="name" type="text" required maxlength="60" placeholder="e.g. Water"></label>
      <label>Amount <input name="amount" type="number" min="0.01" step="0.01" required class="money-input"></label>
      <label>Due day <input name="dueDay" type="number" min="1" max="31" required value="1" class="money-input"></label>
      <label>Category <select name="category">${state.categories.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select></label>
      <button class="btn" type="submit">Add bill</button>
    </form>
  </section>`;
}

export function renderReports() {
  const m = viewState.month;
  const novSpent = spentByCategory("2026-11");
  const octSpent = state.lastMonth.spentByCategory;
  const novTotal = Object.values(novSpent).reduce((a, b) => a + b, 0);
  const octTotal = Object.values(octSpent).reduce((a, b) => a + b, 0);
  const parts = state.categories
    .map((c) => ({ name: c.name, value: novSpent[c.id] ?? 0, color: c.color }))
    .filter((p) => p.value > 0)
    .sort((a, b) => b.value - a.value);
  const needs = ["housing", "groceries", "utilities", "transport", "health", "kids"].reduce((s, id) => s + (novSpent[id] ?? 0), 0);
  const wants = ["dining", "entertainment", "clothing", "misc"].reduce((s, id) => s + (novSpent[id] ?? 0), 0);
  const saved = novSpent.savings ?? 0;
  const share = (v) => (novTotal ? Math.round((v / novTotal) * 100) : 0);
  const change = octTotal ? Math.round(((novTotal - octTotal) / octTotal) * 100) : 0;
  const biggest = parts[0];
  const biggestTx = [...state.transactions].filter((t) => t.type !== "income").sort((a, b) => b.amount - a.amount)[0];

  return `
  <section class="page-head"><div><p class="eyebrow">Reports · October vs November 2026</p>
  <h1>The month in numbers.</h1>
  <p class="lede">November spending is ${Math.abs(change)}% ${change <= 0 ? "lower" : "higher"} than October (${money(octTotal)} → ${money(novTotal)}). The biggest category is ${esc(biggest.name)} at ${money(biggest.value)}.</p></div>
  ${monthSwitcher()}</section>

  <div class="grid-2">
    <section class="card"><h2>Income vs spending</h2>
      ${monthBars([
        { label: "October", income: state.lastMonth.income, spent: octTotal },
        { label: "November", income: income("2026-11"), spent: novTotal },
      ])}
      <p class="muted">November income ${money(income("2026-11"))} against ${money(novTotal)} spent — a ${money(income("2026-11") - novTotal)} surplus, of which ${money(saved)} went straight to savings.</p>
    </section>
    <section class="card"><h2>Where November's money went</h2>
      <div class="donut-wrap">${donut(parts.map((p) => ({ ...p, monthLabel: "November" })))}
      <ul class="donut-legend">${parts.map((p) => `<li><span class="swatch" style="background:${p.color}"></span>${esc(p.name)}<strong>${money(p.value)} · ${share(p.value)}%</strong></li>`).join("")}</ul></div>
    </section>
  </div>

  <section class="card"><h2>The 50 / 30 / 20 rule</h2>
    <p class="muted">Needs should take about half of spending, wants under a third, savings at least a fifth. Here is how November actually landed:</p>
    ${[
      ["Needs — housing, food, bills, transport", needs, 50],
      ["Wants — eating out, fun, clothes", wants, 30],
      ["Savings", saved, 20],
    ].map(([label, v, target]) => `<div class="rule-row"><span>${label}</span><span><strong>${share(v)}%</strong> · target ${target}%</span></div>${progressBar(v, novTotal, "#234636")}`).join("")}
    <p class="muted">Verdict: needs are on target, wants are a touch high after the museum day and two dinners out — and savings are ahead of the 20% line, which is exactly where a household wants to be.</p>
  </section>

  <section class="card"><h2>Three things worth knowing</h2>
    <ul class="insights">
      <li><strong>Biggest single expense:</strong> ${esc(biggestTx.desc)} — ${money(biggestTx.amount)} on ${biggestTx.date}.</li>
      <li><strong>Groceries are the lever:</strong> ${money(novSpent.groceries)} so far against a ${money0(catById("groceries").budget)} budget — the weekly Costco run is doing the heavy lifting.</li>
      <li><strong>Four days left in the month:</strong> ${money(income("2026-11") - novTotal)} remains unspent, and only the ${money(320)} car payment is still due.</li>
    </ul>
  </section>`;
}

export function renderSettings() {
  return `
  <section class="page-head"><div><p class="eyebrow">Settings</p>
  <h1>Make it yours.</h1>
  <p class="lede">Household details, currency and your data. Everything is stored only in this browser — nothing leaves the device.</p></div></section>
  <section class="card"><h2>Household</h2>
    <form data-form="settings" class="inline-form">
      <label>Household name <input name="name" type="text" required maxlength="60" value="${esc(state.household.name)}"></label>
      <label>Currency <select name="currency">
        <option value="USD" ${state.settings.currency === "USD" ? "selected" : ""}>USD — US dollar ($)</option>
        <option value="EUR" ${state.settings.currency === "EUR" ? "selected" : ""}>EUR — Euro (€)</option>
        <option value="GBP" ${state.settings.currency === "GBP" ? "selected" : ""}>GBP — Pound sterling (£)</option>
      </select></label>
      <button class="btn" type="submit">Save settings</button>
    </form>
    <p class="muted">Members: ${state.household.members.map(esc).join(", ")}.</p>
  </section>
  <section class="card"><h2>Your data</h2>
    <p class="muted">Hearthside keeps every change in this browser's local storage, so the budget survives a refresh and stays private. If storage is blocked, the site still works — it just starts fresh on the next visit.</p>
    <div class="inline-form">
      <button class="btn" data-action="export">Download my data (.json)</button>
      <button class="btn danger" data-action="reset">Reset to the November sample data</button>
    </div>
    <p class="muted" id="settings-note" aria-live="polite"></p>
  </section>
  <section class="card"><h2>About Hearthside</h2>
    <p class="muted">Hearthside is a household budget planner built as a single static site: no accounts, no tracking, no network requests. The sample household — Maya and Jordan Hartley, with Noah and Lily — is fictional, and every figure on the site is sample data you can replace with your own.</p>
  </section>`;
}

export const PAGES = {
  "/": renderDashboard,
  "/budget": renderBudget,
  "/transactions": renderTransactions,
  "/goals": renderGoals,
  "/bills": renderBills,
  "/reports": renderReports,
  "/settings": renderSettings,
};

export function pageTitle(path) {
  return {
    "/": "Dashboard",
    "/budget": "Budgets",
    "/transactions": "Transactions",
    "/goals": "Savings goals",
    "/bills": "Bills",
    "/reports": "Reports",
    "/settings": "Settings",
  }[path] ?? "Dashboard";
}
