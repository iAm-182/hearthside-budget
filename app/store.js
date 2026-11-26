// Hearthside store — loads the seed data, keeps every change in localStorage
// when the browser allows it, and always works even when it does not.
import { HOUSEHOLD, CATEGORIES, TRANSACTIONS, BILLS, GOALS, LAST_MONTH } from "./data.js";

const KEY = "hearthside-v1";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function seedState() {
  return {
    household: clone(HOUSEHOLD),
    categories: clone(CATEGORIES),
    transactions: clone(TRANSACTIONS),
    bills: clone(BILLS),
    goals: clone(GOALS),
    lastMonth: clone(LAST_MONTH),
    settings: { currency: "USD", monthStart: 1 },
  };
}

function loadSaved() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export const state = loadSaved() ?? seedState();

export function save() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage blocked or full: the site keeps working in memory.
  }
}

export function resetAll() {
  const fresh = seedState();
  for (const k of Object.keys(fresh)) state[k] = fresh[k];
  save();
}

export function money(n) {
  const symbol = state.settings.currency === "USD" ? "$" : state.settings.currency + " ";
  return symbol + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function money0(n) {
  const symbol = state.settings.currency === "USD" ? "$" : state.settings.currency + " ";
  return symbol + Math.round(Number(n)).toLocaleString("en-US");
}

export function catById(id) {
  return state.categories.find((c) => c.id === id) ?? { id, name: "Uncategorized", color: "#6b6b6b", icon: "dots" };
}

export function monthOf(date) {
  return String(date).slice(0, 7);
}

export function txInMonth(month) {
  return state.transactions.filter((t) => monthOf(t.date) === month);
}

export function income(month) {
  return txInMonth(month).filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
}

export function spentByCategory(month) {
  const out = {};
  for (const c of state.categories) out[c.id] = 0;
  for (const t of txInMonth(month)) {
    if (t.type === "income") continue;
    out[t.category] = (out[t.category] ?? 0) + t.amount;
  }
  return out;
}

export function totalSpent(month) {
  return Object.values(spentByCategory(month)).reduce((a, b) => a + b, 0);
}

export function totalBudgeted() {
  return state.categories.reduce((s, c) => s + c.budget, 0);
}

export function nextTxId() {
  let n = state.transactions.length + 1;
  while (state.transactions.some((t) => t.id === "t" + String(n).padStart(2, "0"))) n += 1;
  return "t" + String(n).padStart(2, "0");
}

export function addTransaction(tx) {
  state.transactions.push({ id: nextTxId(), ...tx });
  state.transactions.sort((a, b) => (a.date < b.date ? 1 : -1));
  save();
}

export function updateTransaction(id, patch) {
  const t = state.transactions.find((x) => x.id === id);
  if (t) Object.assign(t, patch);
  state.transactions.sort((a, b) => (a.date < b.date ? 1 : -1));
  save();
}

export function deleteTransaction(id) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
  save();
}

export function setBudget(categoryId, amount) {
  const c = state.categories.find((x) => x.id === categoryId);
  if (c) c.budget = Math.max(0, Number(amount) || 0);
  save();
}

export function addCategory(name, budget) {
  const id = "c" + Date.now().toString(36);
  state.categories.push({ id, name, budget: Number(budget) || 0, color: "#4d7c5f", icon: "dots" });
  save();
  return id;
}

export function addFunds(goalId, amount) {
  const g = state.goals.find((x) => x.id === goalId);
  if (g) g.saved = Math.min(g.target, Math.max(0, g.saved + Number(amount)));
  save();
}

export function addGoal(name, target) {
  const id = "g" + Date.now().toString(36);
  state.goals.push({ id, name, target: Number(target) || 0, saved: 0, note: "" });
  save();
  return id;
}

export function toggleBill(id) {
  const b = state.bills.find((x) => x.id === id);
  if (b) b.paid = !b.paid;
  save();
}

export function addBill(name, amount, dueDay, category) {
  const id = "b" + Date.now().toString(36);
  state.bills.push({ id, name, amount: Number(amount) || 0, dueDay: Number(dueDay) || 1, paid: false, category });
  state.bills.sort((a, b) => a.dueDay - b.dueDay);
  save();
  return id;
}

export function exportJSON() {
  return JSON.stringify(
    {
      household: state.household,
      exportedAt: new Date().toISOString(),
      categories: state.categories,
      transactions: state.transactions,
      bills: state.bills,
      goals: state.goals,
    },
    null,
    2,
  );
}
