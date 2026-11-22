/* ============================================================
   app.js — Views, routing and interactions
   ============================================================ */

const App = {
  state: { weather: null, recommendation: null, loading: false, searchResults: [], selectedCrop: null },
  actions: {},
  forms: {}
};

const root = document.getElementById('app');

/* ---------------- Routing ---------------- */
function path() { return (location.hash || '#/').replace(/^#/, '') || '/'; }

const APP_VIEWS = ['dashboard', 'field', 'weather', 'recommendation', 'analytics', 'admin', 'profile'];

async function route() {
  const p = path();
  const view = p.startsWith('/app/') ? p.split('/')[2] : null;

  if (view && APP_VIEWS.includes(view)) {
    const user = DB.current();
    if (!user) { location.hash = '#/login'; return; }
    const adminOnly = ['admin'];
    const farmerOnly = ['dashboard', 'field', 'weather', 'recommendation', 'analytics'];
    if (adminOnly.includes(view) && user.role !== 'admin') { location.hash = '#/app/dashboard'; return; }
    if (farmerOnly.includes(view) && user.role === 'admin') { location.hash = '#/app/admin'; return; }
    if (['dashboard', 'weather', 'recommendation', 'analytics'].includes(view)) {
      await loadWeatherIfNeeded();
    }
  }
  render();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

async function loadWeatherIfNeeded(force = false) {
  const user = DB.current();
  if (!user || !user.farm) return;
  const loc = user.farm.location;
  const key = `${loc.lat},${loc.lon}`;
  if (!force && App.state.weather && App.state.weather.locKey === key) return;
  App.state.loading = true;
  render();
  const w = await Weather.fetch(loc);
  w.locKey = key;
  App.state.weather = w;
  App.state.recommendation = Recommend.compute(user.farm, w);
  App.state.loading = false;
}

function go(url) { location.hash = '#' + url; }

/* ---------------- Render dispatcher ---------------- */
function render() {
  const p = path();
  let html;
  if (p === '/' || p === '') html = viewLanding();
  else if (p === '/login') html = viewAuth('login');
  else if (p === '/register') html = viewAuth('register');
  else if (p.startsWith('/app/')) {
    const v = p.split('/')[2];
    html = shell(v, appView(v));
  } else html = viewLanding();
  root.innerHTML = html;
  afterRender(p);
}

function afterRender(p) {
  const w = App.state.weather;
  if (!w) return;
  const temp = document.getElementById('chart-temp');
  if (temp) Charts.line(temp, {
    labels: w.daily.map(d => Utils.fmtDay(d.date)),
    series: [
      { name: 'Max °C', color: '#2e9b62', data: w.daily.map(d => d.tmax), fill: true },
      { name: 'Min °C', color: '#3b82c4', data: w.daily.map(d => d.tmin) }
    ]
  });
  const rain = document.getElementById('chart-rain');
  if (rain) Charts.bars(rain, {
    labels: w.daily.map(d => Utils.fmtDay(d.date)),
    series: [{ name: 'Rain (mm)', color: '#3b82c4', data: w.daily.map(d => d.rain) }]
  });
  const hist = document.getElementById('chart-history');
  if (hist) {
    const h = DB.history(DB.current()?.id).slice(0, 8).reverse();
    Charts.bars(hist, {
      labels: h.map(r => Utils.fmtDate(r.date)),
      series: [{ name: 'Litres', color: '#a7d86a', data: h.map(r => r.waterLiters) }]
    });
  }
}

/* ============================================================
   PUBLIC VIEWS
   ============================================================ */
function pubNav() {
  return `<nav class="pub-nav"><div class="container">
    <a href="#/" class="brand"><span class="brand-mark">🌱</span><span>Smart Irrigation</span></a>
    <div class="nav-links">
      <a href="#how">How it works</a><a href="#features">Features</a><a href="#about">About</a>
      <a href="#/login" class="btn btn-outline btn-sm">Sign in</a>
      <a href="#/register" class="btn btn-sm">Get started</a>
    </div>
  </div></nav>`;
}

function viewLanding() {
  return `<div class="public">
    ${pubNav()}
    <header class="hero"><div class="container hero-grid">
      <div>
        <span class="eyebrow">🌾 Application of AI in Agriculture</span>
        <h1>Grow more, <em>waste less</em> — one smart irrigation decision at a time.</h1>
        <p class="lead">A farmer-friendly web application that brings crop selection, local weather and soil information together to give clear, timely irrigation guidance.</p>
        <div class="hero-actions">
          <a href="#/register" class="btn">Create free account →</a>
          <a href="#how" class="btn btn-outline">See how it works</a>
        </div>
        <div class="hero-trust">
          <div class="trust-item">✅ <span><b>No hardware needed</b> — software prototype</span></div>
          <div class="trust-item">🌦️ <span><b>Live local weather</b> via Open-Meteo</span></div>
          <div class="trust-item">📊 <span><b>Explainable</b> recommendations</span></div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="float-card main">
          <div class="row between"><div><div class="small muted">Your field · Rice (Paddy)</div><div class="bold">Today's irrigation guidance</div></div><span class="badge">🌿 Live</span></div>
          <div class="rec-banner mt-2"><span style="font-size:1.8rem">💧</span><div><div class="big">Irrigation recommended</div><div class="small">Early morning · within 24 hours</div></div></div>
          <div class="metric-row">
            <div class="metric-box"><div class="v">4.2 <span style="font-size:.7rem">mm</span></div><div class="l">Crop water use</div></div>
            <div class="metric-box"><div class="v">0.0 <span style="font-size:.7rem">mm</span></div><div class="l">Forecast rain</div></div>
            <div class="metric-box"><div class="v">6,300 <span style="font-size:.7rem">L</span></div><div class="l">Est. water need</div></div>
          </div>
        </div>
        <div class="mini-card one">🌤️ 32°C · 62% humidity</div>
        <div class="mini-card two">📈 Weather + soil + crop, together</div>
      </div>
    </div></header>

    <section class="section section-tint" id="features"><div class="container">
      <div class="section-head"><span class="eyebrow">What you get</span><h2>Everything a farmer needs, in one simple dashboard</h2><p>Designed around the project's objectives — accessible, understandable and honest about what the data can and cannot tell you.</p></div>
      <div class="feature-grid">
        <div class="feature"><div class="ico">👤</div><h3>Farmer accounts</h3><p>Register and log in to keep your field details, crop choices and irrigation history in one place.</p></div>
        <div class="feature"><div class="ico">🌱</div><h3>Crop-aware advice</h3><p>Choose your crop and growth stage so recommendations reflect its actual water requirements.</p></div>
        <div class="feature"><div class="ico">🌦️</div><h3>Local weather</h3><p>Location-based temperature, humidity, rainfall and a 7-day forecast from a live weather service.</p></div>
        <div class="feature"><div class="ico">💧</div><h3>Irrigation guidance</h3><p>A clear yes / soon / no answer, suggested timing and an estimated water quantity with the reasoning shown.</p></div>
        <div class="feature"><div class="ico">📊</div><h3>Analytics & history</h3><p>Visual trends for weather and a record of past recommendations, so you can see how conditions change.</p></div>
        <div class="feature"><div class="ico">⚙️</div><h3>Admin controls</h3><p>An administrator area to manage farmer accounts and the crop reference information used by the system.</p></div>
      </div>
    </div></section>

    <section class="section" id="how"><div class="container">
      <div class="section-head"><span class="eyebrow">How it works</span><h2>From field details to a decision in four steps</h2></div>
      <div class="steps">
        <div class="step"><h4>Set up your field</h4><p>Pick a crop, growth stage, field area and location. Add soil moisture if you have it.</p></div>
        <div class="step"><h4>We gather conditions</h4><p>The app retrieves current weather and a 7-day forecast for your location.</p></div>
        <div class="step"><h4>Analysis runs</h4><p>A transparent, FAO-56-style water-balance method estimates crop water need against rain and soil.</p></div>
        <div class="step"><h4>You get guidance</h4><p>The dashboard shows whether to irrigate, when, and roughly how much water — with the reasons listed.</p></div>
      </div>
    </div></section>

    <section class="section section-tint" id="about"><div class="container">
      <div class="cta-band">
        <h2>Ready to plan smarter irrigation?</h2>
        <p>This is a student software prototype built for the Interdisciplinary Project at Adamas University. No sensors or pumps — just clear decision support.</p>
        <a href="#/register" class="btn btn-light">Create your free account →</a>
      </div>
    </div></section>

    <footer class="pub-footer"><div class="container">
      <div><div class="brand"><span class="brand-mark">🌱</span><span>Smart Irrigation</span></div><p>AI-Powered Smart Irrigation System · Interdisciplinary Project · Adamas University · 2026–2027</p></div>
      <div class="small">A planning-stage prototype. Recommendations are estimates and should be combined with local farming knowledge.</div>
    </div></footer>
  </div>`;
}

function viewAuth(mode) {
  const isLogin = mode === 'login';
  return `<div class="auth-wrap">
    <aside class="auth-art">
      <a href="#/" class="brand" style="color:#fff"><span class="brand-mark">🌱</span><span>Smart Irrigation</span></a>
      <div><h2>Water is life.<br>Let's use it wisely.</h2><p>Join a simple, data-driven approach to irrigation planning — built to make complex information easy to act on.</p></div>
      <div class="quote">"The system is intended to assist farmers; it does not replace local agricultural expertise or field verification."<br><span class="small">— Project report, Introduction</span></div>
    </aside>
    <main class="auth-panel"><div class="auth-form">
      <h1>${isLogin ? 'Welcome back' : 'Create your account'}</h1>
      <p>${isLogin ? 'Sign in to access your field dashboard.' : 'Start planning smarter irrigation in a minute.'}</p>
      <form data-form="${isLogin ? 'login' : 'register'}">
        ${isLogin ? '' : `<div class="field"><label>Full name</label><input class="input" name="name" required placeholder="Your name" /></div>`}
        <div class="field"><label>Email address</label><input class="input" type="email" name="email" required placeholder="you@example.com" /></div>
        <div class="field"><label>Password</label><input class="input" type="password" name="password" required minlength="4" placeholder="At least 4 characters" /></div>
        <button class="btn btn-block" type="submit">${isLogin ? 'Sign in' : 'Create account'}</button>
      </form>
      <p class="center small muted mt-2">${isLogin ? `New here? <a href="#/register" style="color:var(--green-700);font-weight:700">Create an account</a>` : `Already registered? <a href="#/login" style="color:var(--green-700);font-weight:700">Sign in</a>`}</p>
      ${isLogin ? `<div class="demo-note"><b>Demo accounts</b><br>Farmer: register a new account, or<br>Admin: <b>admin@idp.edu</b> / <b>admin123</b></div>` : ''}
      <p class="center tiny muted mt-2"><a href="#/">← Back to home</a></p>
    </div></main>
  </div>`;
}

/* ============================================================
   APP SHELL
   ============================================================ */
function shell(view, content) {
  const user = DB.current();
  const nav = user.role === 'admin' ? [
    ['dashboard', '📊', 'Overview'], ['admin', '🛠️', 'Manage system'], ['profile', '👤', 'My profile']
  ] : [
    ['dashboard', '🏠', 'Dashboard'], ['field', '🌱', 'My field & crop'], ['weather', '🌦️', 'Weather'],
    ['recommendation', '💧', 'Irrigation advice'], ['analytics', '📈', 'Analytics'], ['profile', '👤', 'My profile']
  ];
  const titles = {
    dashboard: ['Dashboard', 'Your field at a glance'], field: ['My field & crop', 'Set up the details used for recommendations'],
    weather: ['Weather', 'Current conditions and 7-day forecast'], recommendation: ['Irrigation advice', 'Your recommendation and how it was reached'],
    analytics: ['Analytics', 'Trends and irrigation history'], admin: ['Manage system', 'Accounts and reference data'],
    profile: ['My profile', 'Your account and field details']
  };
  const [title, sub] = titles[view] || ['', ''];
  const navHtml = nav.map(([id, ico, lbl]) =>
    `<button class="nav-item ${view === id ? 'active' : ''}" data-action="nav" data-view="${id}"><span class="ni">${ico}</span><span class="lbl">${lbl}</span></button>`
  ).join('');

  return `<div class="shell">
    <aside class="sidebar">
      <a href="#/" class="brand"><span class="brand-mark">🌱</span><span>Smart Irrigation</span></a>
      <div class="nav-group"><div class="nav-label">Menu</div>${navHtml}</div>
      <div class="sidebar-foot">
        <div class="user-chip"><div class="avatar">${Utils.initials(user.name)}</div><div class="txt"><div class="nm">${Utils.esc(user.name)}</div><div class="rl">${user.role}</div></div></div>
        <button class="nav-item mt-1" data-action="logout"><span class="ni">↩️</span><span class="lbl">Sign out</span></button>
      </div>
    </aside>
    <main class="main">
      <header class="topbar"><div><h1>${title}</h1><div class="crumb">Smart Irrigation / ${title} · ${sub}</div></div>
        <div class="top-actions"><span class="badge">${user.role === 'admin' ? '⚙️ Admin' : '🌾 Farmer'}</span><button class="btn-icon" data-action="refresh" title="Refresh weather">🔄</button></div>
      </header>
      <div class="content">${content}</div>
    </main>
  </div>`;
}

function loadingBlock() {
  return `<div class="card"><div class="row" style="gap:14px"><div class="spinner"></div><div><div class="bold">Fetching local weather…</div><div class="small muted">Retrieving conditions for your field location.</div></div></div>
    <div class="mt-3" style="display:grid;gap:12px"><div class="skeleton" style="height:90px"></div><div class="skeleton" style="height:150px"></div></div></div>`;
}

/* ============================================================
   APP VIEWS
   ============================================================ */
function appView(v) {
  if (App.state.loading) return loadingBlock();
  switch (v) {
    case 'dashboard': return viewDashboard();
    case 'field': return viewField();
    case 'weather': return viewWeather();
    case 'recommendation': return viewRecommendation();
    case 'analytics': return viewAnalytics();
    case 'admin': return viewAdmin();
    case 'profile': return viewProfile();
    default: return viewDashboard();
  }
}

function weatherStrip(w) {
  return `<div class="weather-strip">${w.daily.slice(0, 5).map(d => {
    const info = weatherInfo(d.code);
    return `<div class="wday"><div class="d">${Utils.fmtDay(d.date)}</div><div class="i">${info[1]}</div><div class="t">${Math.round(d.tmax)}° / ${Math.round(d.tmin)}°</div><div class="r">💧 ${Utils.num(d.rain)} mm</div></div>`;
  }).join('')}</div>`;
}

function recCard(r, compact = false) {
  const icon = r.status === 'no' ? '✅' : r.status === 'soon' ? '⏳' : '💧';
  return `<div class="rec-card ${r.tone}">
    <div class="kicker">${icon} Irrigation decision support</div>
    <div class="headline">${r.headline}</div>
    <div class="desc">${Utils.esc(r.desc)}</div>
    <div class="rec-metrics">
      <div class="m"><div class="v">${r.waterLiters.toLocaleString('en-IN')} L</div><div class="l">Estimated water for your field</div></div>
      <div class="m"><div class="v">${Utils.num(r.netMm)} mm</div><div class="l">Net water need</div></div>
      <div class="m"><div class="v">${Utils.esc(r.cropEmoji)} ${Utils.esc(r.crop)}</div><div class="l">Selected crop</div></div>
    </div>
    ${compact ? '' : `<div class="mt-2 small" style="opacity:.9">🕒 ${Utils.esc(r.timing)}</div>`}
  </div>`;
}

function viewDashboard() {
  const user = DB.current(), w = App.state.weather, r = App.state.recommendation;
  if (!w || !r) return loadingBlock();
  const info = weatherInfo(w.current.code);
  const hist = DB.history(user.id);
  const statusBadge = r.status === 'no' ? '<span class="badge">✅ No irrigation</span>' : r.status === 'soon' ? '<span class="badge amber">⏳ Monitor</span>' : '<span class="badge blue">💧 Irrigate</span>';
  return `
    <div class="stat-grid">
      <div class="stat"><div class="stat-ico">🌡️</div><div class="label">Current temperature</div><div class="value">${Math.round(w.current.temp)}°C</div><div class="foot">${info[0]} · ${Utils.esc(w.location)}</div></div>
      <div class="stat"><div class="stat-ico">💧</div><div class="label">Humidity</div><div class="value">${Math.round(w.current.humidity)}%</div><div class="foot">Relative humidity now</div></div>
      <div class="stat"><div class="stat-ico">🌧️</div><div class="label">Rain today</div><div class="value">${Utils.num(w.daily[0]?.rain)} <span style="font-size:.9rem">mm</span></div><div class="foot">${Utils.num(w.daily[0]?.rainProb)}% chance of rain</div></div>
      <div class="stat"><div class="stat-ico">🌱</div><div class="label">Selected crop</div><div class="value" style="font-size:1.25rem">${r.cropEmoji} ${Utils.esc(r.crop)}</div><div class="foot">${Utils.esc(r.stage)}</div></div>
    </div>

    <div class="grid-2 mt-3">
      <div>
        ${recCard(r)}
        <div class="info-box mt-2 ${w.demo ? 'warn' : 'ok'}"><span class="ib-ico">${w.demo ? '⚠️' : '🛰️'}</span><div><b>${w.demo ? 'Demo weather in use' : 'Live weather connected'}</b><br>${Utils.esc(r.weatherNote)}. ${Utils.esc(r.confidence)}.</div></div>
        <div class="card mt-2"><div class="row between mb-2"><div><div class="card-title">Next 5 days</div><div class="card-sub">Temperature and expected rainfall</div></div>${statusBadge}</div>${weatherStrip(w)}</div>
      </div>
      <div>
        <div class="card">
          <div class="card-title">Your field</div><div class="card-sub">The inputs behind every recommendation</div>
          <ul class="factor-list">
            <li><span class="fi">📍</span><span><b>Location:</b> ${Utils.esc(user.farm.location.name)}</span></li>
            <li><span class="fi">📐</span><span><b>Field area:</b> ${user.farm.areaSqM.toLocaleString('en-IN')} m²</span></li>
            <li><span class="fi">🌱</span><span><b>Crop & stage:</b> ${Utils.esc(r.crop)} · ${Utils.esc(r.stage)}</span></li>
            <li><span class="fi">🌍</span><span><b>Soil:</b> ${Utils.esc((SOIL_TYPES.find(s => s.id === user.farm.soil.type) || {}).name)} · ${user.farm.soil.moisturePct != null ? user.farm.soil.moisturePct + '% moisture' : 'moisture not set'}</span></li>
          </ul>
          <button class="btn btn-outline btn-block mt-3" data-action="nav" data-view="field">✏️ Edit field details</button>
        </div>
        <div class="card mt-2">
          <div class="card-title">Quick actions</div><div class="card-sub">Explore the system</div>
          <div style="display:grid;gap:8px">
            <button class="btn btn-outline btn-block" data-action="nav" data-view="recommendation">💧 View full recommendation</button>
            <button class="btn btn-outline btn-block" data-action="nav" data-view="weather">🌦️ Detailed weather forecast</button>
            <button class="btn btn-outline btn-block" data-action="nav" data-view="analytics">📈 Charts & irrigation history</button>
          </div>
        </div>
        <div class="card mt-2"><div class="card-title">Recent activity</div><div class="card-sub">Saved recommendations</div>
          ${hist.length ? `<div class="small">${hist.slice(0, 3).map(h => `<div class="row between" style="padding:7px 0;border-bottom:1px dashed var(--line)"><span>${Utils.esc(h.crop)} · ${Utils.fmtDate(h.date)}</span><b>${h.waterLiters.toLocaleString('en-IN')} L</b></div>`).join('')}</div>` : `<div class="empty" style="padding:18px"><div class="em">📝</div><div class="small">No saved recommendations yet.</div></div>`}
        </div>
      </div>
    </div>`;
}

function viewField() {
  const user = DB.current(), f = user.farm;
  const selected = App.state.selectedCrop || f.crop;
  const results = App.state.searchResults;
  return `<div class="grid-2">
    <div class="card card-pad-lg">
      <div class="card-title">🌱 Crop & growth stage</div><div class="card-sub">Water needs depend heavily on what you grow and where it is in its cycle.</div>
      <div class="crop-grid">${CROPS.map(c => `<button class="crop-opt ${selected === c.id ? 'selected' : ''}" data-action="pick-crop" data-crop="${c.id}"><div class="em">${c.emoji}</div><div class="nm">${c.name}</div></button>`).join('')}</div>
      <div class="field mt-3"><label>Growth stage</label><select class="select" id="f-stage">${GROWTH_STAGES.map(s => `<option value="${s.id}" ${f.stage === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}</select></div>
      <div class="info-box"><span class="ib-ico">${(CROPS.find(c => c.id === selected) || {}).emoji || '🌱'}</span><div>${Utils.esc((CROPS.find(c => c.id === selected) || {}).note || '')}</div></div>
    </div>
    <div>
      <div class="card card-pad-lg">
        <div class="card-title">📐 Field & location</div><div class="card-sub">Used to estimate water quantity and fetch local weather.</div>
        <div class="field"><label>Field area (square metres)</label><input class="input" id="f-area" type="number" min="1" value="${f.areaSqM}" /><div class="hint">1 hectare = 10,000 m² · 1 acre ≈ 4,047 m²</div></div>
        <div class="field"><label>Field location</label>
          <div class="input-group"><input class="input" id="loc-search" placeholder="Search a town or city…" /><button class="btn" data-action="search-loc">Search</button></div>
          <div class="hint">Current: ${Utils.esc(f.location.name)}</div>
        </div>
        <div id="loc-results">${results.length ? locationResultsHtml(results) : `<div class="row wrap" style="gap:6px;margin-top:8px">${DEFAULT_LOCATIONS.slice(0, 4).map(l => `<button class="btn btn-outline btn-sm" data-action="use-loc" data-name="${Utils.esc(l.name)}" data-lat="${l.lat}" data-lon="${l.lon}">${Utils.esc(l.name.split(',')[0])}</button>`).join('')}</div>`}</div>
      </div>
      <div class="card card-pad-lg mt-2">
        <div class="card-title">🌍 Soil information</div><div class="card-sub">Soil moisture is optional, but adding it makes the estimate more specific.</div>
        <div class="field"><label>Soil type</label><select class="select" id="f-soil-type">${SOIL_TYPES.map(s => `<option value="${s.id}" ${f.soil.type === s.id ? 'selected' : ''}>${s.name} — ${s.label}</option>`).join('')}</select></div>
        <div class="field"><label>Soil moisture (%)</label><input class="input" id="f-moisture" type="number" min="0" max="100" step="0.5" value="${f.soil.moisturePct ?? ''}" placeholder="e.g. 24" /><div class="hint">Leave blank if you do not have a measurement. The app will say the estimate is indicative.</div></div>
        <button class="btn btn-block" data-action="save-field">💾 Save field details</button>
      </div>
    </div>
  </div>`;
}

function locationResultsHtml(results) {
  return `<div class="card" style="box-shadow:none;background:var(--green-50);padding:10px;margin-top:8px">${results.map((r, i) => `<button class="nav-item" style="color:var(--ink);background:#fff;margin-bottom:5px" data-action="use-loc" data-name="${Utils.esc(r.name)}" data-lat="${r.lat}" data-lon="${r.lon}">📍 ${Utils.esc(r.name)}</button>`).join('')}</div>`;
}

function viewWeather() {
  const w = App.state.weather;
  if (!w) return loadingBlock();
  const c = w.current, info = weatherInfo(c.code);
  return `
    <div class="card card-pad-lg">
      <div class="row between wrap"><div><div class="card-title">Current conditions · ${Utils.esc(w.location)}</div><div class="card-sub">${w.demo ? 'Demo data — live service unreachable' : 'Live data from Open-Meteo'} · updated ${Utils.fmtDate(c.time, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div></div><div style="font-size:3rem">${info[1]}</div></div>
      <div class="stat-grid mt-2">
        <div class="stat"><div class="label">Temperature</div><div class="value">${Math.round(c.temp)}°C</div><div class="foot">${info[0]}</div></div>
        <div class="stat"><div class="label">Humidity</div><div class="value">${Math.round(c.humidity)}%</div><div class="foot">Relative humidity</div></div>
        <div class="stat"><div class="label">Precipitation</div><div class="value">${Utils.num(c.rain)} mm</div><div class="foot">Current</div></div>
        <div class="stat"><div class="label">Wind speed</div><div class="value">${Utils.num(c.wind)} <span style="font-size:.9rem">km/h</span></div><div class="foot">At 10 m height</div></div>
      </div>
    </div>
    <div class="card mt-2"><div class="card-title">7-day outlook</div><div class="card-sub">Daily temperature range and rainfall</div>${weatherStrip(w)}
      <div class="table-wrap mt-3"><table class="data"><thead><tr><th>Day</th><th>Conditions</th><th>Max / Min</th><th>Rainfall</th><th>Chance of rain</th><th>ET₀ (ref. evap.)</th></tr></thead><tbody>
        ${w.daily.map(d => `<tr><td><b>${Utils.fmtDay(d.date)}</b><br><span class="muted tiny">${Utils.fmtDate(d.date)}</span></td><td>${weatherInfo(d.code)[1]} ${weatherInfo(d.code)[0]}</td><td>${Math.round(d.tmax)}° / ${Math.round(d.tmin)}°C</td><td>${Utils.num(d.rain)} mm</td><td>${Math.round(d.rainProb)}%</td><td>${Utils.num(d.et0)} mm</td></tr>`).join('')}
      </tbody></table></div>
    </div>
    <div class="grid-2-even mt-2">
      <div class="card"><div class="card-title">Temperature trend</div><div class="card-sub">Daily maximum and minimum (°C)</div><div class="chart-box" id="chart-temp"></div><div class="legend"><span><i style="background:#2e9b62"></i> Max temp</span><span><i style="background:#3b82c4"></i> Min temp</span></div></div>
      <div class="card"><div class="card-title">Expected rainfall</div><div class="card-sub">Forecast precipitation (mm)</div><div class="chart-box" id="chart-rain"></div><div class="legend"><span><i style="background:#3b82c4"></i> Rainfall (mm)</span></div></div>
    </div>`;
}

function viewRecommendation() {
  const r = App.state.recommendation, w = App.state.weather;
  if (!r || !w) return loadingBlock();
  const hist = DB.history(DB.current().id);
  return `
    ${recCard(r)}
    <div class="grid-2 mt-3">
      <div class="card">
        <div class="card-title">🔍 How this recommendation was reached</div><div class="card-sub">A transparent, rule-based water-balance method — no black box.</div>
        <ul class="factor-list">${r.factors.map(f => `<li><span class="fi">${f.icon}</span><span>${f.text}</span></li>`).join('')}</ul>
        <div class="info-box mt-2 ${r.hasMoisture ? 'ok' : 'warn'}"><span class="ib-ico">${r.hasMoisture ? '✅' : '⚠️'}</span><div><b>${r.confidence}</b><br>${r.weatherNote}.</div></div>
      </div>
      <div>
        <div class="card">
          <div class="card-title">💧 Water estimate breakdown</div><div class="card-sub">1 mm of water over 1 m² = 1 litre</div>
          <div class="factor-list">
            <li><span class="fi">1️⃣</span><span>Crop water use (ET₀ × K<sub>c</sub>): <b>${Utils.num(r.et0)} × ${r.kc} = ${Utils.num(r.etc)} mm/day</b></span></li>
            <li><span class="fi">2️⃣</span><span>Less effective rainfall: <b>− ${Utils.num(r.effectiveRain)} mm</b></span></li>
            <li><span class="fi">3️⃣</span><span>Adjusted for soil moisture → net need: <b>${Utils.num(r.netMm)} mm</b></span></li>
            <li><span class="fi">4️⃣</span><span>Divided by 80% application efficiency: <b>${Utils.num(r.grossMm)} mm</b></span></li>
            <li><span class="fi">5️⃣</span><span>× field area (${r.area.toLocaleString('en-IN')} m²): <b>${r.waterLiters.toLocaleString('en-IN')} litres</b></span></li>
          </div>
          <button class="btn btn-block mt-3" data-action="save-rec">💾 Save this recommendation to history</button>
        </div>
        <div class="card mt-2"><div class="card-title">🕒 Suggested timing</div><p class="small muted">${Utils.esc(r.timing)}</p>
          <div class="info-box warn"><span class="ib-ico">ℹ️</span><div>This is an estimate. Always consider local conditions, recent field observations and expert advice before irrigating.</div></div>
        </div>
      </div>
    </div>
    <div class="card mt-2"><div class="row between"><div><div class="card-title">Saved recommendation history</div><div class="card-sub">${hist.length} record${hist.length === 1 ? '' : 's'}</div></div>${hist.length ? `<button class="btn btn-danger btn-sm" data-action="clear-history">Clear history</button>` : ''}</div>
      ${hist.length ? `<div class="table-wrap mt-2"><table class="data"><thead><tr><th>Date</th><th>Crop</th><th>Decision</th><th>Water</th><th>Weather source</th></tr></thead><tbody>${hist.map(h => `<tr><td>${Utils.fmtDate(h.date, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td><td>${Utils.esc(h.crop)}</td><td><span class="badge ${h.status === 'no' ? '' : h.status === 'soon' ? 'amber' : 'blue'}">${Utils.esc(h.headline)}</span></td><td>${h.waterLiters.toLocaleString('en-IN')} L</td><td>${Utils.esc(h.weatherNote)}</td></tr>`).join('')}</tbody></table></div>` : `<div class="empty"><div class="em">📝</div><h3>No history yet</h3><p>Save a recommendation to start tracking your irrigation decisions.</p></div>`}
    </div>`;
}

function viewAnalytics() {
  const w = App.state.weather, r = App.state.recommendation;
  if (!w || !r) return loadingBlock();
  const hist = DB.history(DB.current().id);
  const total = hist.reduce((s, h) => s + h.waterLiters, 0);
  const avgRain = w.daily.reduce((s, d) => s + Number(d.rain), 0) / w.daily.length;
  return `
    <div class="stat-grid">
      <div class="stat"><div class="stat-ico">📈</div><div class="label">7-day avg rainfall</div><div class="value">${Utils.num(avgRain)} <span style="font-size:.9rem">mm</span></div><div class="foot">Across the forecast</div></div>
      <div class="stat"><div class="stat-ico">🌡️</div><div class="label">Avg max temperature</div><div class="value">${Math.round(w.daily.reduce((s, d) => s + d.tmax, 0) / w.daily.length)}°C</div><div class="foot">Next 7 days</div></div>
      <div class="stat"><div class="stat-ico">💧</div><div class="label">Current water need</div><div class="value">${r.waterLiters.toLocaleString('en-IN')} <span style="font-size:.9rem">L</span></div><div class="foot">For your field</div></div>
      <div class="stat"><div class="stat-ico">🗂️</div><div class="label">Saved decisions</div><div class="value">${hist.length}</div><div class="foot">${total.toLocaleString('en-IN')} L recorded</div></div>
    </div>
    <div class="grid-2-even mt-3">
      <div class="card"><div class="card-title">Temperature trend</div><div class="card-sub">Maximum and minimum temperatures over 7 days</div><div class="chart-box" id="chart-temp"></div><div class="legend"><span><i style="background:#2e9b62"></i> Max</span><span><i style="background:#3b82c4"></i> Min</span></div></div>
      <div class="card"><div class="card-title">Rainfall forecast</div><div class="card-sub">Expected precipitation per day (mm)</div><div class="chart-box" id="chart-rain"></div><div class="legend"><span><i style="background:#3b82c4"></i> Rainfall (mm)</span></div></div>
    </div>
    <div class="card mt-2"><div class="card-title">Water recommended over time</div><div class="card-sub">From your saved recommendations (litres)</div>
      ${hist.length ? `<div class="chart-box" id="chart-history"></div><div class="legend"><span><i style="background:#a7d86a"></i> Litres recommended</span></div>` : `<div class="empty"><div class="em">📊</div><h3>Nothing to chart yet</h3><p>Save recommendations from the Irrigation advice page to see them here.</p></div>`}
    </div>`;
}

function viewAdmin() {
  const users = DB.users().filter(u => u.role === 'farmer');
  const allHistory = DB.history();
  return `
    <div class="stat-grid">
      <div class="stat"><div class="stat-ico">👥</div><div class="label">Registered farmers</div><div class="value">${users.length}</div><div class="foot">Accounts on this device</div></div>
      <div class="stat"><div class="stat-ico">💧</div><div class="label">Total recommendations</div><div class="value">${allHistory.length}</div><div class="foot">Saved across all farmers</div></div>
      <div class="stat"><div class="stat-ico">🌱</div><div class="label">Crops in catalogue</div><div class="value">${CROPS.length}</div><div class="foot">Reference data</div></div>
      <div class="stat"><div class="stat-ico">🛰️</div><div class="label">Weather source</div><div class="value" style="font-size:1.1rem">Open-Meteo</div><div class="foot">Free, no API key</div></div>
    </div>
    <div class="card mt-3"><div class="card-title">Farmer accounts</div><div class="card-sub">Manage the farmers registered on this device</div>
      ${users.length ? `<div class="table-wrap"><table class="data"><thead><tr><th>Name</th><th>Email</th><th>Crop</th><th>Location</th><th>Joined</th><th></th></tr></thead><tbody>${users.map(u => `<tr><td><div class="row"><div class="avatar" style="width:30px;height:30px;font-size:.75rem">${Utils.initials(u.name)}</div><b>${Utils.esc(u.name)}</b></div></td><td>${Utils.esc(u.email)}</td><td>${Utils.esc((CROPS.find(c => c.id === u.farm?.crop) || {}).name || '—')}</td><td>${Utils.esc(u.farm?.location?.name || '—')}</td><td>${Utils.fmtDate(u.createdAt)}</td><td><button class="btn btn-danger btn-sm" data-action="del-user" data-id="${u.id}">Remove</button></td></tr>`).join('')}</tbody></table></div>` : `<div class="empty"><div class="em">👤</div><h3>No farmers yet</h3><p>Farmers who register will appear here.</p></div>`}
    </div>
    <div class="grid-2-even mt-2">
      <div class="card"><div class="card-title">Crop reference data</div><div class="card-sub">Crop coefficients (K<sub>c</sub>) used by the recommendation engine</div>
        <div class="table-wrap"><table class="data"><thead><tr><th>Crop</th><th>Initial</th><th>Mid</th><th>End</th></tr></thead><tbody>${CROPS.map(c => `<tr><td>${c.emoji} ${c.name}</td><td>${c.kc.init}</td><td>${c.kc.mid}</td><td>${c.kc.end}</td></tr>`).join('')}</tbody></table></div>
      </div>
      <div class="card"><div class="card-title">System information</div><div class="card-sub">About this prototype</div>
        <ul class="factor-list">
          <li><span class="fi">🎓</span><span>Interdisciplinary Project · Adamas University · 2026–2027</span></li>
          <li><span class="fi">📋</span><span>Software-based decision support — no sensors or automated pumps</span></li>
          <li><span class="fi">🧮</span><span>Transparent FAO-56-style water-balance baseline</span></li>
          <li><span class="fi">🌦️</span><span>Weather via Open-Meteo; geocoding via Open-Meteo Geocoding API</span></li>
          <li><span class="fi">💾</span><span>Data stored locally in your browser (localStorage)</span></li>
          <li><span class="fi">⚠️</span><span>Planning-stage prototype — outputs are estimates, not validated field results</span></li>
        </ul>
      </div>
    </div>`;
}

function viewProfile() {
  const u = DB.current(), hist = DB.history(u.id);
  return `<div class="grid-2-even">
    <div class="card card-pad-lg"><div class="card-title">👤 Account details</div><div class="card-sub">Your registered information</div>
      <ul class="factor-list">
        <li><span class="fi">📛</span><span><b>Name:</b> ${Utils.esc(u.name)}</span></li>
        <li><span class="fi">✉️</span><span><b>Email:</b> ${Utils.esc(u.email)}</span></li>
        <li><span class="fi">🏷️</span><span><b>Role:</b> ${u.role}</span></li>
        <li><span class="fi">📅</span><span><b>Member since:</b> ${Utils.fmtDate(u.createdAt, { day: 'numeric', month: 'long', year: 'numeric' })}</span></li>
        <li><span class="fi">💧</span><span><b>Saved recommendations:</b> ${hist.length}</span></li>
      </ul>
      <button class="btn btn-outline btn-block mt-3" data-action="logout">Sign out</button>
    </div>
    <div class="card card-pad-lg"><div class="card-title">🌾 Field summary</div><div class="card-sub">The configuration used for your recommendations</div>
      <ul class="factor-list">
        <li><span class="fi">🌱</span><span><b>Crop:</b> ${Utils.esc((CROPS.find(c => c.id === u.farm?.crop) || {}).name || '—')}</span></li>
        <li><span class="fi">📈</span><span><b>Stage:</b> ${Utils.esc((GROWTH_STAGES.find(s => s.id === u.farm?.stage) || {}).name || '—')}</span></li>
        <li><span class="fi">📐</span><span><b>Area:</b> ${u.farm?.areaSqM?.toLocaleString('en-IN') || '—'} m²</span></li>
        <li><span class="fi">📍</span><span><b>Location:</b> ${Utils.esc(u.farm?.location?.name || '—')}</span></li>
        <li><span class="fi">🌍</span><span><b>Soil:</b> ${Utils.esc((SOIL_TYPES.find(s => s.id === u.farm?.soil?.type) || {}).name || '—')}</span></li>
      </ul>
      <button class="btn btn-block mt-3" data-action="nav" data-view="field">✏️ Edit field details</button>
    </div>
  </div>`;
}

/* ============================================================
   EVENTS
   ============================================================ */
App.actions = {
  nav(el) { go('/app/' + el.dataset.view); },
  logout() { DB.logout(); App.state.weather = null; App.state.recommendation = null; Utils.toast('Signed out.'); go('/'); },
  async refresh() {
    Utils.toast('Refreshing weather…');
    await loadWeatherIfNeeded(true);
    render(); afterRender(path());
  },
  'pick-crop'(el) {
    App.state.selectedCrop = el.dataset.crop;
    render();
  },
  async 'search-loc'() {
    const q = document.getElementById('loc-search')?.value.trim();
    if (!q) { Utils.toast('Enter a place name to search.', 'err'); return; }
    const box = document.getElementById('loc-results');
    box.innerHTML = '<div class="row"><div class="spinner"></div><span class="small muted">Searching…</span></div>';
    try {
      const results = await Weather.geocode(q);
      App.state.searchResults = results;
      if (!results.length) { box.innerHTML = '<div class="small muted mt-1">No matches found. Try another name.</div>'; return; }
      box.innerHTML = locationResultsHtml(results);
    } catch (e) { box.innerHTML = `<div class="small" style="color:var(--red)">Location search unavailable. Use a suggested location below.</div>`; }
  },
  async 'use-loc'(el) {
    const user = DB.current();
    const loc = { name: el.dataset.name, lat: parseFloat(el.dataset.lat), lon: parseFloat(el.dataset.lon) };
    DB.update(user.id, { farm: { ...user.farm, location: loc } });
    App.state.searchResults = [];
    Utils.toast('Location updated. Saving field…');
    await saveFieldAndRefresh();
  },
  async 'save-field'() { await saveFieldAndRefresh(); },
  'save-rec'() {
    const r = App.state.recommendation, u = DB.current();
    DB.addHistory({
      id: Utils.uid(), userId: u.id, date: new Date().toISOString(), crop: r.crop,
      status: r.status, headline: r.headline, waterLiters: r.waterLiters,
      weatherNote: r.weatherNote, netMm: r.netMm
    });
    Utils.toast('Recommendation saved to history.');
    render(); afterRender(path());
  },
  'clear-history'() {
    if (!confirm('Clear all saved recommendations?')) return;
    DB.clearHistory(DB.current().id); Utils.toast('History cleared.'); render(); afterRender(path());
  },
  'del-user'(el) {
    if (!confirm('Remove this farmer account and their history?')) return;
    DB.removeUser(el.dataset.id); Utils.toast('Farmer account removed.'); render();
  }
};

async function saveFieldAndRefresh() {
  const user = DB.current();
  const crop = App.state.selectedCrop || user.farm.crop;
  const area = parseFloat(document.getElementById('f-area')?.value) || user.farm.areaSqM;
  const stage = document.getElementById('f-stage')?.value || user.farm.stage;
  const soilType = document.getElementById('f-soil-type')?.value || user.farm.soil.type;
  const moistureRaw = document.getElementById('f-moisture')?.value;
  const moisturePct = moistureRaw === '' || moistureRaw == null ? null : parseFloat(moistureRaw);
  const updated = DB.update(user.id, {
    farm: { ...user.farm, crop, stage, areaSqM: area, soil: { type: soilType, moisturePct } }
  });
  App.state.selectedCrop = null;
  App.state.weather = null;
  await loadWeatherIfNeeded(true);
  App.state.recommendation = Recommend.compute(updated.farm, App.state.weather);
  Utils.toast('Field details saved. Recommendation updated.');
  go('/app/dashboard');
}

App.forms = {
  login(f) {
    try { const u = DB.login(f.email.value, f.password.value); Utils.toast(`Welcome back, ${u.name.split(' ')[0]}!`); go(u.role === 'admin' ? '/app/admin' : '/app/dashboard'); }
    catch (e) { Utils.toast(e.message, 'err'); }
  },
  register(f) {
    try { const u = DB.register({ name: f.name.value, email: f.email.value, password: f.password.value }); Utils.toast('Account created! Let\'s set up your field.'); go('/app/field'); }
    catch (e) { Utils.toast(e.message, 'err'); }
  }
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const fn = App.actions[el.dataset.action];
  if (fn) { e.preventDefault(); fn(el, e); }
});

document.addEventListener('submit', e => {
  const f = e.target.closest('[data-form]');
  if (!f) return;
  e.preventDefault();
  const fn = App.forms[f.dataset.form];
  if (fn) fn(f);
});

window.addEventListener('hashchange', route);

/* ---------------- Boot ---------------- */
DB.init();
route();