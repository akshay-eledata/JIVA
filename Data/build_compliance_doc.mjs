// Renders Data/Deployment_Security_Compliance.md into a single self contained
// HTML page for the Artifact. The markdown subset is fixed (I authored the
// source), so a purpose built converter is safer here than a dependency the
// repo does not have.
import { readFileSync, writeFileSync } from 'node:fs';

const ROOT = '/Users/akshayivatury/Documents/EleData/JIVA_Buildout';
const FONTS = `${ROOT}/JIVA_React_App/node_modules/@fontsource`;
const md = readFileSync(`${ROOT}/Data/Deployment_Security_Compliance.md`, 'utf8');

const b64 = (p) => readFileSync(p).toString('base64');
const face = (fam, weight, file) => `@font-face{font-family:'${fam}';font-style:normal;font-weight:${weight};font-display:swap;src:url(data:font/woff2;base64,${b64(file)}) format('woff2');}`;

const fontCss = [
  face('Lexend', 400, `${FONTS}/lexend/files/lexend-latin-400-normal.woff2`),
  face('Lexend', 600, `${FONTS}/lexend/files/lexend-latin-600-normal.woff2`),
  face('Lexend', 700, `${FONTS}/lexend/files/lexend-latin-700-normal.woff2`),
  face('Inter', 400, `${FONTS}/inter/files/inter-latin-400-normal.woff2`),
  face('Inter', 600, `${FONTS}/inter/files/inter-latin-600-normal.woff2`),
].join('\n');

// ---------- inline ----------
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function inline(raw) {
  const code = [];
  let s = raw.replace(/`([^`]+)`/g, (_, c) => {
    code.push(`<code>${esc(c)}</code>`);
    return `%%CODE${code.length - 1}%%`; // sentinel: survives esc(), absent from prose
  });
  s = esc(s);
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, h) =>
    `<a href="${h}"${h.startsWith('#') ? '' : ' target="_blank" rel="noopener"'}>${t}</a>`);
  s = s.replace(/\*\*\[COUNSEL([^\]]*)\]\*\*/g, (_, extra) =>
    `<span class="pill pill-counsel">Counsel${extra ? esc(extra).replace(/^,\s*/, ': ') : ''}</span>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/%%CODE(\d+)%%/g, (_, i) => code[+i]);
  return s;
}

const slug = (t) => t.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');

// Severity words carry meaning in the gap-analysis tables, so give them form as
// well as text. Only the leading token of a cell is treated as a severity.
const SEV = { critical: 'critical', high: 'high', medium: 'medium', low: 'low' };
function severity(cellHtml) {
  const m = cellHtml.match(/^(?:<strong>)?(Critical|High|Medium|Low)(?:<\/strong>)?(\.|\b)/);
  if (!m) return cellHtml;
  const key = SEV[m[1].toLowerCase()];
  const rest = cellHtml.slice(m[0].length);
  return `<span class="sev sev-${key}">${m[1]}</span>${rest}`;
}

// ---------- block ----------
const lines = md.split('\n');
const out = [];
const toc = [];
let i = 0;
let skipping = false; // the source "Contents" list becomes the sticky rail

const flushList = (buf, tag) => {
  if (!buf.length) return;
  out.push(`<${tag}>${buf.map((li) => `<li>${inline(li)}</li>`).join('')}</${tag}>`);
  buf.length = 0;
};

while (i < lines.length) {
  const line = lines[i];

  // fenced code (only mermaid appears in this document)
  if (/^```/.test(line)) {
    const lang = line.slice(3).trim();
    const body = [];
    i++;
    while (i < lines.length && !/^```/.test(lines[i])) body.push(lines[i++]);
    i++;
    out.push(lang === 'mermaid'
      ? `<div class="figure"><pre class="mermaid">${esc(body.join('\n'))}</pre></div>`
      : `<pre class="code"><code>${esc(body.join('\n'))}</code></pre>`);
    continue;
  }

  // headings
  const h = line.match(/^(#{1,3})\s+(.*)$/);
  if (h) {
    const level = h[1].length;
    const text = h[2].replace(/\s*\{#.*\}$/, '');
    if (level === 2 && /^Contents$/.test(text)) { skipping = true; i++; continue; }
    skipping = false;
    const id = slug(text);
    if (level === 2) {
      const num = text.match(/^(\d+)\.\s+(.*)$/);
      toc.push({ id, num: num ? num[1] : '', label: num ? num[2] : text });
      out.push(`<h2 id="${id}">${num ? `<span class="hnum">${num[1]}</span>` : ''}<span>${inline(num ? num[2] : text)}</span></h2>`);
    } else if (level === 1) {
      // The masthead already states the title; a second h1 would duplicate it.
      /* skipped */
    } else {
      out.push(`<h3 id="${id}">${inline(text)}</h3>`);
    }
    i++;
    continue;
  }

  if (skipping) { i++; continue; }

  // horizontal rule
  if (/^---\s*$/.test(line)) { out.push('<hr />'); i++; continue; }

  // blockquote
  if (/^>/.test(line)) {
    const body = [];
    while (i < lines.length && /^>/.test(lines[i])) body.push(lines[i++].replace(/^>\s?/, ''));
    const paras = body.filter((p) => p.trim());
    out.push(`<blockquote>${paras.map((p) => `<p>${inline(p)}</p>`).join('')}</blockquote>`);
    continue;
  }

  // table
  if (/^\|/.test(line) && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1] || '')) {
    const cells = (r) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
    const head = cells(line);
    i += 2;
    const rows = [];
    while (i < lines.length && /^\|/.test(lines[i])) rows.push(cells(lines[i++]));
    out.push(
      `<div class="tablewrap"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>` +
      `<tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${severity(inline(c))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`
    );
    continue;
  }

  // lists
  if (/^\s*-\s+/.test(line)) {
    const buf = [];
    while (i < lines.length && /^\s*-\s+/.test(lines[i])) buf.push(lines[i++].replace(/^\s*-\s+/, ''));
    flushList(buf, 'ul');
    continue;
  }
  if (/^\s*\d+\.\s+/.test(line)) {
    const buf = [];
    const start = line.match(/^\s*(\d+)\./)[1];
    while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) buf.push(lines[i++].replace(/^\s*\d+\.\s+/, ''));
    out.push(`<ol start="${start}">${buf.map((li) => `<li>${inline(li)}</li>`).join('')}</ol>`);
    continue;
  }

  // paragraph
  if (line.trim()) {
    const buf = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !/^(\||#{1,3}\s|>|-\s|\d+\.\s|```|---\s*$)/.test(lines[i])) buf.push(lines[i++]);
    out.push(`<p>${inline(buf.join(' '))}</p>`);
    continue;
  }
  i++;
}

for (let k = out.length - 2; k >= 0; k--) {
  if (out[k] === '<hr />' && out[k + 1].startsWith('<h2')) out.splice(k, 1);
}

const rail = toc.map((t) =>
  `<li><a href="#${t.id}"><span class="rnum">${t.num}</span><span>${t.label}</span></a></li>`).join('');

const css = `
${fontCss}
:root{
  --ground:#F3F9F3; --surface:#FFFFFF; --raise:#FBFDFB;
  --ink:#17301B; --body:#3E4B41; --muted:#6C7C70;
  --green:#2A6130; --green-soft:#E8F1E8; --lime:#D5E274; --saga:#DDEEDE;
  --rule:#CDDFCF; --hair:#E2EDE3;
  --critical:#8C2F1E; --critical-bg:#F7E7E3;
  --high:#8A5A12; --high-bg:#F7EEDD;
  --medium:#3E5F6B; --medium-bg:#E4EEF1;
  --low:#4A6B4E; --low-bg:#E8F1E8;
  --shadow:0 1px 2px rgba(23,48,27,.05), 0 8px 24px -18px rgba(23,48,27,.35);
}
@media (prefers-color-scheme: dark){
  :root{
    --ground:#101A13; --surface:#17231A; --raise:#1B2A1E;
    --ink:#E7F0E8; --body:#B4C4B7; --muted:#859889;
    --green:#8FC79A; --green-soft:#1F3324; --lime:#D5E274; --saga:#243528;
    --rule:#2B3E2F; --hair:#22321F;
    --critical:#E39A87; --critical-bg:#3A211C;
    --high:#DCB160; --high-bg:#33280F;
    --medium:#93BCC9; --medium-bg:#1B2C31;
    --low:#9CC3A2; --low-bg:#1E3123;
    --shadow:0 1px 2px rgba(0,0,0,.3), 0 10px 30px -20px rgba(0,0,0,.8);
  }
}
:root[data-theme="light"]{
  --ground:#F3F9F3; --surface:#FFFFFF; --raise:#FBFDFB;
  --ink:#17301B; --body:#3E4B41; --muted:#6C7C70;
  --green:#2A6130; --green-soft:#E8F1E8; --saga:#DDEEDE;
  --rule:#CDDFCF; --hair:#E2EDE3;
  --critical:#8C2F1E; --critical-bg:#F7E7E3;
  --high:#8A5A12; --high-bg:#F7EEDD;
  --medium:#3E5F6B; --medium-bg:#E4EEF1;
  --low:#4A6B4E; --low-bg:#E8F1E8;
}
:root[data-theme="dark"]{
  --ground:#101A13; --surface:#17231A; --raise:#1B2A1E;
  --ink:#E7F0E8; --body:#B4C4B7; --muted:#859889;
  --green:#8FC79A; --green-soft:#1F3324; --saga:#243528;
  --rule:#2B3E2F; --hair:#22321F;
  --critical:#E39A87; --critical-bg:#3A211C;
  --high:#DCB160; --high-bg:#33280F;
  --medium:#93BCC9; --medium-bg:#1B2C31;
  --low:#9CC3A2; --low-bg:#1E3123;
}

*{box-sizing:border-box;}
body{
  margin:0; background:var(--ground); color:var(--body);
  font-family:'Inter',system-ui,-apple-system,sans-serif;
  font-size:16px; line-height:1.65; -webkit-font-smoothing:antialiased;
}
.shell{max-width:1360px; margin:0 auto; padding:0 24px 96px;}
.layout{display:grid; grid-template-columns:minmax(0,1fr); gap:48px;}
@media (min-width:1080px){ .layout{grid-template-columns:236px minmax(0,1fr);} }

/* masthead */
.masthead{
  border-bottom:1px solid var(--rule); padding:56px 0 28px; margin-bottom:44px;
  display:flex; flex-wrap:wrap; gap:28px; align-items:flex-end; justify-content:space-between;
}
.eyebrow{
  font-family:'Lexend',sans-serif; font-weight:600; font-size:.68rem;
  letter-spacing:.16em; text-transform:uppercase; color:var(--green); margin:0 0 12px;
}
.masthead h1{margin:0; max-width:22ch;}
.meta{display:flex; flex-direction:column; gap:6px; font-size:.82rem; color:var(--muted);}
.meta b{color:var(--ink); font-weight:600;}
.meta .row{display:flex; gap:10px; align-items:baseline;}
.meta .k{
  font-family:'Lexend',sans-serif; font-size:.64rem; letter-spacing:.13em;
  text-transform:uppercase; color:var(--muted); min-width:76px;
}

/* rail */
.rail{display:none;}
@media (min-width:1080px){
  .rail{display:block; position:sticky; top:32px; align-self:start; max-height:calc(100vh - 64px); overflow-y:auto;}
}
.rail h2{display:block; border-top:0; padding-top:0;
  font-family:'Lexend',sans-serif; font-size:.64rem; letter-spacing:.15em;
  text-transform:uppercase; color:var(--muted); margin:0 0 14px; font-weight:600;
}
.rail ol{list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:1px;}
.rail a{
  display:flex; gap:10px; padding:6px 10px 6px 0; text-decoration:none;
  color:var(--body); font-size:.82rem; line-height:1.35; border-left:2px solid transparent;
  padding-left:12px; transition:color .15s, border-color .15s;
}
.rail a:hover{color:var(--ink); border-left-color:var(--green);}
.rail .rnum{
  font-variant-numeric:tabular-nums; color:var(--muted); font-size:.72rem;
  min-width:1.1em; padding-top:.12em;
}

/* type */
h1,h2,h3{font-family:'Lexend',sans-serif; color:var(--ink); text-wrap:balance;}
h1{font-weight:700; font-size:clamp(2rem,4.2vw,2.9rem); line-height:1.1; letter-spacing:-.022em;}
h2{
  font-weight:600; font-size:1.45rem; line-height:1.25; letter-spacing:-.012em;
  margin:72px 0 22px; padding-top:22px; border-top:1px solid var(--rule);
  display:flex; gap:16px; align-items:baseline;
}
h2 .hnum{
  font-size:.78rem; font-variant-numeric:tabular-nums; color:var(--green);
  letter-spacing:.06em; padding-top:.1em; min-width:1.6em;
}
h3{font-weight:600; font-size:1.02rem; letter-spacing:-.004em; margin:40px 0 12px; color:var(--ink);}
h3::before{
  content:""; display:block; width:26px; height:3px; background:var(--lime);
  border-radius:2px; margin-bottom:12px;
}
p{margin:0 0 18px; max-width:74ch;}
a{color:var(--green); text-underline-offset:2px; text-decoration-thickness:1px;}
strong{color:var(--ink); font-weight:600;}
ul,ol{margin:0 0 20px; padding-left:1.25rem; max-width:74ch;}
li{margin-bottom:8px;}
li::marker{color:var(--green);}
hr{border:0; border-top:1px solid var(--hair); margin:44px 0;}
code{
  font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:.845em;
  background:var(--green-soft); color:var(--ink);
  padding:.12em .38em; border-radius:4px; word-break:break-word;
}

/* brief */
blockquote{
  margin:0 0 36px; padding:22px 26px; background:var(--surface);
  border:1px solid var(--rule); border-left:3px solid var(--green);
  border-radius:3px; box-shadow:var(--shadow);
}
blockquote p{margin:0 0 12px; font-size:.9rem; max-width:82ch;}
blockquote p:last-child{margin:0;}

/* tables */
.tablewrap{
  overflow-x:auto; margin:0 0 30px; border:1px solid var(--rule);
  border-radius:3px; background:var(--surface); box-shadow:var(--shadow);
}
table{border-collapse:collapse; width:100%; font-size:.845rem; min-width:560px;}
thead th{
  position:sticky; top:0; z-index:1; background:var(--saga); color:var(--ink);
  font-family:'Lexend',sans-serif; font-weight:600; font-size:.66rem;
  letter-spacing:.1em; text-transform:uppercase; text-align:left;
  padding:11px 16px; border-bottom:1px solid var(--rule); white-space:nowrap;
}
tbody td{
  padding:12px 16px; border-bottom:1px solid var(--hair);
  vertical-align:top; font-variant-numeric:tabular-nums;
}
tbody tr:last-child td{border-bottom:0;}
tbody tr:hover{background:var(--raise);}
tbody td:first-child{color:var(--ink);}

/* chips */
.sev{
  display:inline-block; font-family:'Lexend',sans-serif; font-weight:600;
  font-size:.62rem; letter-spacing:.09em; text-transform:uppercase;
  padding:2px 8px; border-radius:2px; white-space:nowrap;
}
.sev-critical{background:var(--critical-bg); color:var(--critical);}
.sev-high{background:var(--high-bg); color:var(--high);}
.sev-medium{background:var(--medium-bg); color:var(--medium);}
.sev-low{background:var(--low-bg); color:var(--low);}
.pill{
  display:inline-block; font-family:'Lexend',sans-serif; font-weight:600;
  font-size:.62rem; letter-spacing:.09em; text-transform:uppercase;
  padding:2px 8px; border-radius:2px; white-space:nowrap;
}
.pill-counsel{background:var(--lime); color:#243B21;}

/* figure */
.figure{
  margin:0 0 30px; padding:24px; background:var(--surface);
  border:1px solid var(--rule); border-radius:3px; overflow-x:auto;
  box-shadow:var(--shadow);
}
.figure pre{margin:0;}
pre.code{
  background:var(--surface); border:1px solid var(--rule); border-radius:3px;
  padding:18px; overflow-x:auto; font-size:.82rem;
}

a:focus-visible,.rail a:focus-visible{outline:2px solid var(--green); outline-offset:3px; border-radius:2px;}
@media (prefers-reduced-motion:reduce){*{transition:none !important; animation:none !important;}}
@media print{
  .rail{display:none;} .layout{grid-template-columns:1fr;}
  h2{break-after:avoid;} .tablewrap,blockquote,.figure{break-inside:avoid; box-shadow:none;}
}
`;

const html = `<style>${css}</style>
<div class="shell">
  <header class="masthead">
    <div>
      <p class="eyebrow">JIVA Health</p>
      <h1>Technology, AWS deployment, security and regulatory compliance</h1>
    </div>
    <div class="meta">
      <div class="row"><span class="k">Prepared</span><b>23 July 2026</b></div>
      <div class="row"><span class="k">Market</span><b>Costa Rica, then Latin America</b></div>
      <div class="row"><span class="k">Source</span><b>Repository at commit 9ef9ec3</b></div>
      <div class="row"><span class="k">Status</span><b>Working document, not legal advice</b></div>
    </div>
  </header>
  <div class="layout">
    <nav class="rail" aria-label="Contents">
      <h2>Contents</h2>
      <ol>${rail}</ol>
    </nav>
    <main>${out.join('\n')}</main>
  </div>
</div>`;

writeFileSync(`${ROOT}/Data/Deployment_Security_Compliance.html`, html);
console.log('bytes:', html.length, '| sections:', toc.length);
