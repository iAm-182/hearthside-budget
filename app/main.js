// Hearthside router + wiring. Hash routes, one page per section; every
// button and form on a page is handled here by delegation, so a re-render
// never leaves a dead control behind.
import {
  state, save, money, resetAll, exportJSON,
  addTransaction, updateTransaction, deleteTransaction,
  setBudget, addCategory, addFunds, addGoal, toggleBill, addBill,
} from "./store.js";
import { PAGES, pageTitle, viewState } from "./views.js";

const app = document.getElementById("app");

function currentPath() {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  return PAGES[hash] ? hash : "/";
}

function render() {
  const path = currentPath();
  document.title = `Hearthside — ${pageTitle(path)}`;
  app.innerHTML = PAGES[path]();
  document.querySelectorAll("[data-nav]").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("data-nav") === path);
  });
  window.scrollTo(0, 0);
}

function download(filename, text) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

app.addEventListener("click", (event) => {
  const el = event.target.closest("[data-action]");
  if (!el) return;
  const action = el.getAttribute("data-action");
  const id = el.getAttribute("data-id");

  if (action === "set-month") {
    viewState.month = el.getAttribute("data-month");
    render();
  } else if (action === "edit-tx") {
    viewState.editingTx = id;
    render();
    const form = app.querySelector('[data-form="transaction"]');
    if (form) form.scrollIntoView({ behavior: "smooth", block: "start" });
  } else if (action === "cancel-edit") {
    viewState.editingTx = null;
    render();
  } else if (action === "delete-tx") {
    const t = state.transactions.find((x) => x.id === id);
    if (t && window.confirm(`Delete "${t.desc}" (${money(t.amount)})?`)) {
      deleteTransaction(id);
      render();
    }
  } else if (action === "toggle-bill") {
    toggleBill(id);
    render();
  } else if (action === "export") {
    download("hearthside-budget.json", exportJSON());
    const note = document.getElementById("settings-note");
    if (note) note.textContent = "Downloaded hearthside-budget.json with your full budget data.";
  } else if (action === "reset") {
    if (window.confirm("Reset everything back to the November sample data? Your changes will be lost.")) {
      resetAll();
      viewState.editingTx = null;
      render();
    }
  }
});

app.addEventListener("change", (event) => {
  const el = event.target.closest("[data-filter]");
  if (!el) return;
  if (el.getAttribute("data-filter") === "category") {
    viewState.txCategory = el.value;
    render();
  }
});

app.addEventListener("input", (event) => {
  const el = event.target.closest("[data-filter='search']");
  if (!el) return;
  viewState.txSearch = el.value;
  // Re-render only the list, keeping focus in the search box.
  const pos = el.selectionStart;
  render();
  const again = app.querySelector("[data-filter='search']");
  if (again) {
    again.focus();
    again.setSelectionRange(pos, pos);
  }
});

app.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-form]");
  if (!form) return;
  event.preventDefault();
  const data = new FormData(form);
  const kind = form.getAttribute("data-form");

  if (kind === "transaction") {
    const id = data.get("id");
    const category = data.get("category");
    const tx = {
      date: String(data.get("date")),
      desc: String(data.get("desc")).trim(),
      category: category === "income" ? "income" : category,
      amount: Math.round(Number(data.get("amount")) * 100) / 100,
      ...(category === "income" ? { type: "income" } : {}),
    };
    if (!tx.desc || !(tx.amount > 0) || !tx.date) return;
    if (id) updateTransaction(id, tx);
    else addTransaction(tx);
    viewState.editingTx = null;
    render();
  } else if (kind === "budget") {
    setBudget(form.getAttribute("data-id"), data.get("amount"));
    render();
  } else if (kind === "add-category") {
    const name = String(data.get("name")).trim();
    if (name) addCategory(name, data.get("amount"));
    render();
  } else if (kind === "add-funds") {
    addFunds(form.getAttribute("data-id"), data.get("amount"));
    render();
  } else if (kind === "add-goal") {
    const name = String(data.get("name")).trim();
    if (name) addGoal(name, data.get("amount"));
    render();
  } else if (kind === "add-bill") {
    const name = String(data.get("name")).trim();
    if (name) addBill(name, data.get("amount"), data.get("dueDay"), data.get("category"));
    render();
  } else if (kind === "settings") {
    state.household.name = String(data.get("name")).trim() || state.household.name;
    state.settings.currency = String(data.get("currency"));
    save();
    render();
    const note = document.getElementById("settings-note");
    if (note) note.textContent = "Settings saved.";
  }
});

window.addEventListener("hashchange", render);
render();
