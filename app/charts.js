// Hearthside charts — hand-rolled SVG, no library. Every chart is built from
// the numbers passed in, so it always matches the tables beside it.
export function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Grouped bar chart: two months side by side, income vs spending.
export function monthBars(months) {
  const W = 640;
  const H = 300;
  const padL = 56;
  const padB = 34;
  const padT = 18;
  const max = Math.max(...months.flatMap((m) => [m.income, m.spent]), 1);
  const plotH = H - padT - padB;
  const plotW = W - padL - 20;
  const groupW = plotW / months.length;
  const barW = Math.min(52, (groupW - 40) / 2);
  const y = (v) => padT + plotH - (v / max) * plotH;

  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Income versus spending by month" class="chart">`;
  for (let i = 0; i <= 4; i++) {
    const v = (max / 4) * i;
    const yy = y(v);
    s += `<line x1="${padL}" y1="${yy}" x2="${W - 10}" y2="${yy}" stroke="#e5ded0" stroke-width="1"/>`;
    s += `<text x="${padL - 8}" y="${yy + 4}" text-anchor="end" class="chart-axis">$${Math.round(v).toLocaleString()}</text>`;
  }
  months.forEach((m, gi) => {
    const cx = padL + groupW * gi + groupW / 2;
    const x1 = cx - barW - 4;
    const x2 = cx + 4;
    s += `<rect x="${x1}" y="${y(m.income)}" width="${barW}" height="${plotH - (y(m.income) - padT)}" rx="4" fill="#234636"><title>${m.label} income $${m.income.toLocaleString()}</title></rect>`;
    s += `<rect x="${x2}" y="${y(m.spent)}" width="${barW}" height="${plotH - (y(m.spent) - padT)}" rx="4" fill="#c96f3f"><title>${m.label} spending $${m.spent.toLocaleString()}</title></rect>`;
    s += `<text x="${cx}" y="${H - 12}" text-anchor="middle" class="chart-label">${esc(m.label)}</text>`;
  });
  s += `<g class="chart-legend"><rect x="${padL}" y="0" width="12" height="12" fill="#234636"/><text x="${padL + 18}" y="11">Income</text><rect x="${padL + 96}" y="0" width="12" height="12" fill="#c96f3f"/><text x="${padL + 114}" y="11">Spending</text></g>`;
  s += "</svg>";
  return s;
}

// Donut chart of spending by category, with a legend table beside it.
export function donut(parts) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  const R = 84;
  const C = 2 * Math.PI * R;
  const cx = 110;
  const cy = 110;
  let offset = 0;
  let s = `<svg viewBox="0 0 220 220" role="img" aria-label="Spending by category" class="chart donut">`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#efe9dc" stroke-width="30"/>`;
  for (const p of parts) {
    if (p.value <= 0) continue;
    const frac = p.value / total;
    const len = frac * C;
    s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${p.color}" stroke-width="30" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})"><title>${esc(p.name)}: $${p.value.toLocaleString()}</title></circle>`;
    offset += len;
  }
  s += `<text x="${cx}" y="${cy - 6}" text-anchor="middle" class="donut-total">$${Math.round(total).toLocaleString()}</text>`;
  s += `<text x="${cx}" y="${cy + 16}" text-anchor="middle" class="donut-caption">spent in ${esc(parts[0]?.monthLabel ?? "")}</text>`;
  s += "</svg>";
  return s;
}

// A thin progress bar: spent against budget, with an over-budget state.
export function progressBar(spent, budget, color) {
  const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
  const over = budget > 0 && spent > budget;
  return `<div class="bar" role="progressbar" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100" aria-label="${Math.round(pct)} percent of budget spent">
    <div class="bar-fill${over ? " over" : ""}" style="width:${pct}%;background:${over ? "#b0483f" : color}"></div>
  </div>`;
}

// A ring showing the share of income saved this month.
export function savingsRing(saved, income) {
  const pct = income > 0 ? Math.min(100, (saved / income) * 100) : 0;
  const R = 52;
  const C = 2 * Math.PI * R;
  const len = (pct / 100) * C;
  return `<svg viewBox="0 0 130 130" role="img" aria-label="Savings rate ${pct.toFixed(1)} percent" class="ring">
    <circle cx="65" cy="65" r="${R}" fill="none" stroke="#efe9dc" stroke-width="12"/>
    <circle cx="65" cy="65" r="${R}" fill="none" stroke="#234636" stroke-width="12" stroke-linecap="round" stroke-dasharray="${len} ${C - len}" transform="rotate(-90 65 65)"/>
    <text x="65" y="61" text-anchor="middle" class="ring-num">${pct.toFixed(1)}%</text>
    <text x="65" y="80" text-anchor="middle" class="ring-cap">saved</text>
  </svg>`;
}
