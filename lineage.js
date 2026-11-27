/* Renders project lineage from window.LINEAGE (lineage-data.js).
   - <div id="lineage-graph"></div>              → git-graph style view (lineage.html)
   - <div id="lineage-table"></div>              → full milestone log (lineage.html)
   - <div id="lineage-strip" data-fyp="2C"></div> → per-FYP history strip  */
(function () {
  const L = window.LINEAGE; if (!L) return;
  const TYPES = {
    initiated: { label: "Initiated", fill: true },
    continued: { label: "Continued", fill: true },
    handover:  { label: "Handover",  fill: true },
    completed: { label: "Completed", fill: true, ring: true },
    deferred:  { label: "Deferred",  fill: false, dash: true },
    retired:   { label: "Retired",   fill: false, cross: true },
    planned:   { label: "Planned",   fill: false }
  };
  const lane = id => L.lanes.find(l => l.id === id);
  const ym = d => { const [y, m] = d.split("-").map(Number); return y * 12 + (m - 1); };
  const fmt = d => { const [y, m] = d.split("-"); return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m - 1] + " " + y; };
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const who = p => { const u = (L.profiles || {})[p]; return u ? `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:underline">${esc(p)}</a>` : esc(p); };
  const evs = L.events.slice().sort((a, b) => ym(a.date) - ym(b.date));
  const now = new Date(); const nowYM = now.getFullYear() * 12 + now.getMonth();

  const css = `
  .lin-legend{display:flex;flex-wrap:wrap;gap:1rem;font-family:'Space Grotesk',sans-serif;font-size:.65rem;color:#8B90A1;margin:.5rem 0 1rem}
  .lin-legend span{display:inline-flex;align-items:center;gap:.35rem}
  .lin-scroll{overflow-x:auto;border:1px solid #414755;border-radius:6px;background:#1C1F29}
  .lin-scroll svg text{font-family:'Space Grotesk',sans-serif}
  .lin-dot{cursor:default}
  .lin-table{width:100%;border-collapse:collapse;font-size:.78rem;margin-top:1rem}
  .lin-table th{font-family:'Space Grotesk',sans-serif;font-size:.6rem;letter-spacing:.06em;text-transform:uppercase;color:#8B90A1;text-align:left;padding:.5rem;border-bottom:1px solid #414755}
  .lin-table td{padding:.5rem;border-bottom:1px solid #2a2e3a;color:#C1C6D7;vertical-align:top}
  .lin-chip{font-family:'Space Grotesk',sans-serif;font-size:.6rem;padding:.1rem .4rem;border:1px solid;border-radius:2px;white-space:nowrap}
  .lin-strip{max-width:960px;margin:0 auto 2.5rem;padding:0 2.5rem}
  .lin-strip .box{background:#1C1F29;border:1px solid #414755;border-radius:6px;padding:1.25rem}
  .lin-strip .lbl{font-family:'Space Grotesk',sans-serif;font-size:.6rem;letter-spacing:.06em;color:#8B90A1;text-transform:uppercase;margin-bottom:.9rem;display:flex;gap:.5rem;align-items:center}
  .lin-strip .lbl::after{content:'';flex:1;height:1px;background:#414755}
  .lin-strip .lbl a{color:#A9C7FF;text-decoration:none;text-transform:none;letter-spacing:0}
  .lin-row{display:flex;align-items:flex-start;gap:0;overflow-x:auto;padding-bottom:.25rem}
  .lin-step{display:flex;flex-direction:column;min-width:150px;position:relative;padding-right:1rem}
  .lin-step::before{content:'';position:absolute;top:6px;left:12px;right:0;height:2px;background:var(--lc)}
  .lin-step:last-child::before{display:none}
  .lin-step .d{width:14px;height:14px;border-radius:50%;border:2px solid var(--lc);background:#0f131c;position:relative;z-index:1}
  .lin-step .d.f{background:var(--lc)}
  .lin-step .when{font-family:'Space Grotesk',sans-serif;font-size:.65rem;color:#DFE2EF;margin-top:.45rem}
  .lin-step .what{font-size:.72rem;color:#8B90A1;line-height:1.4;margin-top:.15rem}
  .lin-step .who{font-size:.72rem;color:#C1C6D7}
  @media(max-width:768px){.lin-strip{padding:0 1rem}}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  function dot(t, c, x, y, r) {
    const T = TYPES[t] || TYPES.continued;
    let s = `<circle cx="${x}" cy="${y}" r="${r}" fill="${T.fill ? c : "#0f131c"}" stroke="${c}" stroke-width="2"${T.dash ? ' stroke-dasharray="3 2"' : ""}/>`;
    if (T.ring) s += `<circle cx="${x}" cy="${y}" r="${r + 4}" fill="none" stroke="${c}" stroke-width="1"/>`;
    if (T.cross) s += `<path d="M${x - 4} ${y - 4}L${x + 4} ${y + 4}M${x + 4} ${y - 4}L${x - 4} ${y + 4}" stroke="${c}" stroke-width="1.5"/>`;
    return s;
  }
  function legend() {
    return `<div class="lin-legend">` + Object.entries(TYPES).map(([k, T]) =>
      `<span><svg width="20" height="20">${dot(k, "#C1C6D7", 10, 10, 5)}</svg>${T.label}</span>`).join("") +
      `<span><svg width="22" height="12"><path d="M1 11 C 11 11, 11 1, 21 1" stroke="#C1C6D7" fill="none" stroke-width="1.5"/></svg>Branched from</span></div>`;
  }

  /* ---------- git-graph ---------- */
  const g = document.getElementById("lineage-graph");
  if (g) {
    const minM = Math.min(...evs.map(e => ym(e.date))) - 1;
    const maxM = Math.max(nowYM, ...evs.map(e => ym(e.date))) + 2;
    const left = 250, colW = 64, rowH = 46, top = 46;
    const W = left + (maxM - minM) * colW + 40, H = top + L.lanes.length * rowH + 20;
    const X = m => left + (m - minM) * colW, Y = i => top + i * rowH + rowH / 2;
    let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Project lineage graph">`;
    for (let m = minM; m <= maxM; m++) {
      const y = Math.floor(m / 12), mo = m % 12;
      s += `<line x1="${X(m)}" y1="${top - 8}" x2="${X(m)}" y2="${H - 10}" stroke="#262A34" stroke-width="1"/>`;
      if (mo % 3 === 0 || m === minM) s += `<text x="${X(m)}" y="${top - 16}" font-size="10" fill="#8B90A1" text-anchor="middle">${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][mo]} ${String(y).slice(2)}</text>`;
    }
    s += `<line x1="${X(nowYM)}" y1="${top - 8}" x2="${X(nowYM)}" y2="${H - 10}" stroke="#4ADE80" stroke-dasharray="4 3"/><text x="${X(nowYM) + 4}" y="${H - 12}" font-size="9" fill="#4ADE80">today</text>`;
    L.lanes.forEach((ln, i) => {
      const le = evs.filter(e => e.fyp === ln.id); const y = Y(i);
      const label = ln.page ? `<a href="${ln.page}"><text x="16" y="${y + 4}" font-size="12" fill="${ln.color}" font-weight="700">FYP-${ln.id}</text></a>` : `<text x="16" y="${y + 4}" font-size="12" fill="${ln.color}" font-weight="700">FYP-${ln.id}</text>`;
      s += label + `<text x="76" y="${y + 4}" font-size="10.5" fill="#C1C6D7">${esc(ln.title)}</text>`;
      if (!le.length) return;
      const a = ym(le[0].date), last = le[le.length - 1];
      const ended = ["retired", "completed"].includes(last.type);
      const b = ended ? ym(last.date) : Math.max(nowYM, ym(last.date));
      const real = le.filter(e => e.type !== "planned"), lastReal = real[real.length - 1];
      const pastEnd = lastReal && lastReal.type === "completed" ? ym(lastReal.date) : Math.min(b, nowYM);
      const idle = last.type === "deferred";
      if (pastEnd > a) s += `<line x1="${X(a)}" y1="${y}" x2="${X(pastEnd)}" y2="${y}" stroke="${ln.color}" stroke-width="${idle ? 1.5 : 3}"${idle ? ' stroke-dasharray="2 4" opacity=".6"' : ""}/>`;
      if (b > pastEnd) s += `<line x1="${X(Math.max(a, pastEnd))}" y1="${y}" x2="${X(b)}" y2="${y}" stroke="${ln.color}" stroke-width="2" stroke-dasharray="5 4"/>`;
      if (ln.parent) {
        const pi = L.lanes.findIndex(l => l.id === ln.parent);
        if (pi >= 0) { const py = Y(pi), x0 = X(a) - colW * .8, x1 = X(a);
          s += `<path d="M${x0} ${py} C ${x0 + colW * .5} ${py}, ${x1 - colW * .5} ${y}, ${x1} ${y}" stroke="${ln.color}" stroke-width="1.5" fill="none" opacity=".7"/>`; }
      }
      le.forEach((e, k) => {
        const x = X(ym(e.date)) + (le.filter((z, j) => j < k && z.date === e.date).length) * 14;
        s += `<g class="lin-dot"><title>FYP-${e.fyp} · ${fmt(e.date)} · ${(TYPES[e.type] || {}).label || e.type} · ${esc(e.person)} — ${esc(e.note)}</title>${dot(e.type, ln.color, x, y, 6)}</g>`;
        if (e.person && !["TBC", "—", "N/A"].includes(e.person) && !le.slice(0, k).some(z => z.person === e.person)) s += ((L.profiles || {})[e.person] ? `<a href="${esc(L.profiles[e.person])}" target="_blank"><text x="${x}" y="${y - 11}" font-size="9" fill="#A9C7FF" text-anchor="middle" text-decoration="underline">${esc(e.person)}</text></a>` : `<text x="${x}" y="${y - 11}" font-size="9" fill="#DFE2EF" text-anchor="middle">${esc(e.person)}</text>`);
      });
    });
    g.innerHTML = legend() + `<div class="lin-scroll">${s}</svg></div>`;
  }

  /* ---------- full log table ---------- */
  const t = document.getElementById("lineage-table");
  if (t) {
    t.innerHTML = `<table class="lin-table"><thead><tr><th>When</th><th>FYP</th><th>Milestone</th><th>Talent</th><th>Note</th></tr></thead><tbody>` +
      evs.slice().reverse().map(e => { const ln = lane(e.fyp) || { color: "#8B90A1" };
        const id = ln.page ? `<a href="${ln.page}" style="color:${ln.color};text-decoration:none">FYP-${e.fyp}</a>` : `<span style="color:${ln.color}">FYP-${e.fyp}</span>`;
        return `<tr><td>${fmt(e.date)}</td><td>${id}</td><td><span class="lin-chip" style="color:${ln.color};border-color:${ln.color}">${(TYPES[e.type] || {}).label || e.type}</span></td><td>${who(e.person)}</td><td>${esc(e.note)}${e.link ? ` · <a href="${esc(e.link)}" style="color:#A9C7FF">report</a>` : ""}</td></tr>`; }).join("") +
      `</tbody></table>`;
  }

  /* ---------- per-FYP strip ---------- */
  const sp = document.getElementById("lineage-strip");
  if (sp) {
    const id = sp.dataset.fyp, ln = lane(id); if (!ln) return;
    const le = evs.filter(e => e.fyp === id);
    const parent = ln.parent && lane(ln.parent);
    const kids = L.lanes.filter(l => l.parent === id);
    const rel = [parent ? `branched from <a href="${parent.page || "#"}" style="color:${parent.color}">FYP-${parent.id}</a>` : "",
                 kids.length ? `feeds ${kids.map(k => `<a href="${k.page || "lineage.html"}" style="color:${k.color}">${k.id}</a>`).join(", ")}` : ""].filter(Boolean).join(" · ");
    sp.className = "lin-strip";
    sp.innerHTML = `<div class="box"><div class="lbl">PROJECT LINEAGE ${rel ? "· " + rel : ""} <a href="lineage.html">full lineage →</a></div>
      <div class="lin-row" style="--lc:${ln.color}">` + (le.length ? le.map(e => {
        const T = TYPES[e.type] || {};
        return `<div class="lin-step"><div class="d ${T.fill ? "f" : ""}"></div><div class="when">${fmt(e.date)} · ${T.label || e.type}</div><div class="who">${who(e.person)}</div><div class="what">${esc(e.note)}</div></div>`;
      }).join("") : `<div class="what" style="font-size:.75rem;color:#8B90A1">No milestones recorded yet.</div>`) + `</div></div>`;
  }
})();
