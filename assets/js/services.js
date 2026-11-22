/* ============================================================
   services.js — Storage, auth, weather, recommendation, charts
   ============================================================ */

/* ---------------- Utilities ---------------- */
const Utils = {
  uid() { return 'id_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); },
  esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  },
  fmtDate(d, opts = { day: 'numeric', month: 'short' }) {
    try { return new Date(d).toLocaleDateString('en-GB', opts); } catch { return String(d); }
  },
  fmtDay(d) {
    try { return new Date(d).toLocaleDateString('en-GB', { weekday: 'short' }); } catch { return ''; }
  },
  num(n, digits = 1) {
    const v = Number(n);
    return Number.isFinite(v) ? v.toFixed(digits).replace(/\.0+$/, '') : '—';
  },
  toast(msg, type = 'ok') {
    const region = document.getElementById('toast-region');
    if (!region) return;
    const el = document.createElement('div');
    el.className = 'toast' + (type === 'err' ? ' err' : '');
    el.innerHTML = `<span>${type === 'err' ? '⚠️' : '✅'}</span><span>${Utils.esc(msg)}</span>`;
    region.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = '.3s'; setTimeout(() => el.remove(), 300); }, 3200);
  },
  initials(name) {
    return String(name || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }
};

/* ---------------- Storage & Auth ---------------- */
const DB = {
  K: { users: 'si_users', session: 'si_session', history: 'si_history', seeded: 'si_seeded' },
  _read(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  _write(key, value) { localStorage.setItem(key, JSON.stringify(value)); },

  init() {
    if (!localStorage.getItem(this.K.seeded)) {
      const admin = {
        id: 'admin-001', name: 'System Administrator', email: 'admin@idp.edu',
        password: 'admin123', role: 'admin', createdAt: new Date().toISOString(),
        farm: null
      };
      this._write(this.K.users, [admin]);
      this._write(this.K.history, []);
      localStorage.setItem(this.K.seeded, '1');
    }
  },
  users() { return this._read(this.K.users, []); },
  saveUsers(u) { this._write(this.K.users, u); },

  register(data) {
    const users = this.users();
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    const user = {
      id: Utils.uid(), name: data.name.trim(), email: data.email.trim().toLowerCase(),
      password: data.password, role: 'farmer', createdAt: new Date().toISOString(),
      farm: {
        crop: 'rice', stage: 'mid', areaSqM: 2000,
        location: { name: 'Kolkata, West Bengal', lat: 22.5726, lon: 88.3639 },
        soil: { type: 'loamy', moisturePct: null }
      }
    };
    users.push(user); this.saveUsers(users);
    this._write(this.K.session, user.id);
    return user;
  },
  login(email, password) {
    const user = this.users().find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
    if (!user) throw new Error('Incorrect email or password.');
    this._write(this.K.session, user.id);
    return user;
  },
  logout() { localStorage.removeItem(this.K.session); },
  current() {
    const id = this._read(this.K.session, null);
    return id ? this.users().find(u => u.id === id) || null : null;
  },
  update(id, patch) {
    const users = this.users();
    const i = users.findIndex(u => u.id === id);
    if (i < 0) return null;
    users[i] = { ...users[i], ...patch };
    this.saveUsers(users);
    return users[i];
  },
  removeUser(id) {
    this.saveUsers(this.users().filter(u => u.id !== id));
    this._write(this.K.history, this.history().filter(h => h.userId !== id));
  },

  history(userId) {
    const all = this._read(this.K.history, []);
    return userId ? all.filter(h => h.userId === userId) : all;
  },
  addHistory(rec) {
    const all = this._read(this.K.history, []);
    all.unshift(rec);
    this._write(this.K.history, all.slice(0, 300));
  },
  clearHistory(userId) {
    this._write(this.K.history, this.history().filter(h => h.userId !== userId));
  }
};

/* ---------------- Weather (Open-Meteo, no API key) ---------------- */
const Weather = {
  async geocode(query) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Location search failed.');
    const json = await res.json();
    return (json.results || []).map(r => ({
      name: [r.name, r.admin1, r.country].filter(Boolean).join(', '),
      lat: r.latitude, lon: r.longitude
    }));
  },

  async fetch(location) {
    const params = new URLSearchParams({
      latitude: location.lat, longitude: location.lon,
      current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,et0_fao_evapotranspiration',
      timezone: 'auto', forecast_days: '7'
    });
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
      if (!res.ok) throw new Error('Weather service unavailable');
      const j = await res.json();
      const daily = (j.daily?.time || []).map((date, i) => ({
        date,
        code: j.daily.weather_code?.[i] ?? 0,
        tmax: j.daily.temperature_2m_max?.[i] ?? 0,
        tmin: j.daily.temperature_2m_min?.[i] ?? 0,
        rain: j.daily.precipitation_sum?.[i] ?? 0,
        rainProb: j.daily.precipitation_probability_max?.[i] ?? 0,
        et0: j.daily.et0_fao_evapotranspiration?.[i] ?? 3.5
      }));
      return {
        demo: false, location: location.name,
        current: {
          temp: j.current?.temperature_2m ?? daily[0]?.tmax ?? 0,
          humidity: j.current?.relative_humidity_2m ?? 60,
          rain: j.current?.precipitation ?? 0,
          code: j.current?.weather_code ?? 0,
          wind: j.current?.wind_speed_10m ?? 0,
          time: j.current?.time || new Date().toISOString()
        },
        daily
      };
    } catch (e) {
      return demoWeather(location);
    }
  }
};

/* ---------------- Recommendation engine (transparent baseline) ---------------- */
const Recommend = {
  compute(farm, weather) {
    const crop = CROPS.find(c => c.id === farm.crop) || CROPS[0];
    const stage = GROWTH_STAGES.find(s => s.id === farm.stage) || GROWTH_STAGES[1];
    const soil = SOIL_TYPES.find(s => s.id === farm.soil?.type) || SOIL_TYPES[0];
    const moisture = farm.soil?.moisturePct;
    const hasMoisture = moisture !== null && moisture !== undefined && moisture !== '';

    const d0 = weather.daily[0] || { et0: 3.5, rain: 0, rainProb: 0 };
    const d1 = weather.daily[1] || { rain: 0, rainProb: 0 };

    // FAO-56 style crop water requirement
    const et0 = Number(d0.et0) || 3.5;                 // mm/day reference evapotranspiration
    const kc = crop.kc[stage.id];                       // crop coefficient
    const etc = et0 * kc;                               // mm/day crop evapotranspiration

    // Effective rainfall over the next ~2 days (weighted toward today)
    const forecastRain = Number(d0.rain || 0) + 0.5 * Number(d1.rain || 0);
    const effectiveRain = Math.min(forecastRain, etc);

    // Soil moisture contribution (indicative scaling against field capacity)
    let soilFactor = 0.85, moistureLabel = 'Not provided — estimate is indicative only';
    if (hasMoisture) {
      const ratio = Number(moisture) / soil.fc;
      if (ratio >= 0.8)      { soilFactor = 0.15; moistureLabel = 'Adequate moisture'; }
      else if (ratio >= 0.6) { soilFactor = 0.40; moistureLabel = 'Moisture slightly low'; }
      else if (ratio >= 0.4) { soilFactor = 0.70; moistureLabel = 'Moisture low'; }
      else                   { soilFactor = 1.00; moistureLabel = 'Soil moisture depleted'; }
    }

    const netNeed = Math.max(0, etc * soilFactor - effectiveRain); // mm
    const efficiency = 0.8;                                        // application efficiency
    const grossMm = netNeed / efficiency;
    const area = Number(farm.areaSqM) || 0;
    const waterLiters = Math.round(grossMm * area);                 // 1 mm over 1 m² = 1 L

    // Decision
    const heavyRain = (Number(d0.rain) >= 10) || (Number(d1.rain) >= 12) ||
                      (Number(d0.rainProb) >= 85 && Number(d0.rain) >= 4);
    let status, headline, desc, timing, tone;
    if (heavyRain || netNeed < 0.5) {
      status = 'no'; tone = 'green';
      headline = 'No irrigation needed now';
      desc = heavyRain
        ? 'Rainfall is expected or has recently occurred. Check the field again in a couple of days.'
        : 'Current soil and weather conditions suggest the crop has enough water for now.';
      timing = 'Re-check in 2–3 days, or after the forecast rain clears.';
    } else if (netNeed < 2) {
      status = 'soon'; tone = 'amber';
      headline = 'Irrigation may be needed soon';
      desc = 'The crop water requirement is modest. Monitor the field and irrigate if conditions stay dry.';
      timing = 'Plan to irrigate within the next 2 days if no rain arrives.';
    } else {
      status = 'yes'; tone = 'blue';
      headline = 'Irrigation recommended';
      desc = 'Estimated crop water use currently exceeds the water available from rain and soil.';
      timing = 'Irrigate within 24 hours — preferably early morning or late evening to reduce evaporation.';
    }

    const factors = [
      { icon: '🌡️', text: `Reference evapotranspiration (ET₀) is <b>${Utils.num(et0)} mm/day</b> from the local weather data.` },
      { icon: crop.emoji, text: `${crop.name} at ${stage.name.toLowerCase()} has a crop coefficient (K<sub>c</sub>) of <b>${kc}</b>, giving a crop water use of <b>${Utils.num(etc)} mm/day</b>.` },
      { icon: '🌧️', text: `Forecast rainfall of <b>${Utils.num(forecastRain)} mm</b> over the next two days can offset about <b>${Utils.num(effectiveRain)} mm</b> of that need.` },
      { icon: '🌱', text: `Soil moisture: <b>${hasMoisture ? moisture + '%' : 'not supplied'}</b> — ${moistureLabel}.` },
      { icon: '📐', text: `For a field of <b>${area.toLocaleString('en-IN')} m²</b> at ${Math.round(efficiency * 100)}% application efficiency, the gross requirement is <b>${Utils.num(grossMm)} mm</b>.` }
    ];

    return {
      status, tone, headline, desc, timing,
      waterLiters, netMm: netNeed, grossMm, etc, et0, kc, effectiveRain,
      crop: crop.name, cropEmoji: crop.emoji, stage: stage.name,
      area, moistureLabel, hasMoisture,
      factors,
      confidence: (hasMoisture && !weather.demo) ? 'Based on live weather and your soil entry' : 'Indicative — add soil moisture for a more specific estimate',
      generatedAt: new Date().toISOString(),
      weatherNote: weather.demo ? 'Demo weather (live service unreachable)' : 'Live weather from Open-Meteo'
    };
  }
};

/* ---------------- Lightweight SVG charts ---------------- */
const Charts = {
  _svg(w, h, inner) {
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" role="img">${inner}</svg>`;
  },
  _scale(v, min, max, top, bottom) {
    if (max === min) return (top + bottom) / 2;
    return bottom - ((v - min) / (max - min)) * (bottom - top);
  },

  line(el, cfg) {
    const w = 640, h = 230, L = 42, R = 12, T = 16, B = 34;
    const labels = cfg.labels || [];
    const series = cfg.series || [];
    const all = series.flatMap(s => s.data.map(Number));
    let min = Math.min(...all), max = Math.max(...all);
    if (!Number.isFinite(min)) { min = 0; max = 1; }
    const pad = (max - min) * 0.15 || 1; min -= pad; max += pad;
    const plotW = w - L - R, plotH = h - T - B;
    const x = i => L + (labels.length <= 1 ? plotW / 2 : (i / (labels.length - 1)) * plotW);
    const y = v => this._scale(v, min, max, T, T + plotH);

    let g = '';
    for (let i = 0; i <= 4; i++) {
      const gy = T + (i / 4) * plotH;
      const val = max - (i / 4) * (max - min);
      g += `<line x1="${L}" y1="${gy}" x2="${w - R}" y2="${gy}" stroke="#e8eee9" stroke-width="1"/>`;
      g += `<text x="${L - 8}" y="${gy + 4}" text-anchor="end" font-size="10" fill="#8a9a8e">${Math.round(val)}</text>`;
    }
    labels.forEach((lb, i) => {
      g += `<text x="${x(i)}" y="${h - 10}" text-anchor="middle" font-size="10" fill="#8a9a8e">${Utils.esc(lb)}</text>`;
    });
    series.forEach(s => {
      const pts = s.data.map((v, i) => `${x(i)},${y(Number(v))}`).join(' ');
      if (s.fill) {
        g += `<polygon points="${x(0)},${T + plotH} ${pts} ${x(s.data.length - 1)},${T + plotH}" fill="${s.color}" opacity="0.10"/>`;
      }
      g += `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
      s.data.forEach((v, i) => {
        g += `<circle cx="${x(i)}" cy="${y(Number(v))}" r="3.5" fill="#fff" stroke="${s.color}" stroke-width="2"><title>${Utils.esc(s.name)}: ${Utils.esc(v)}</title></circle>`;
      });
    });
    el.innerHTML = this._svg(w, h, g);
  },

  bars(el, cfg) {
    const w = 640, h = 230, L = 42, R = 12, T = 16, B = 34;
    const labels = cfg.labels || [], series = cfg.series || [];
    const all = series.flatMap(s => s.data.map(Number));
    const max = Math.max(1, ...all) * 1.15;
    const plotW = w - L - R, plotH = h - T - B;
    const groupW = plotW / Math.max(1, labels.length);
    const barW = Math.min(26, (groupW - 10) / Math.max(1, series.length));
    let g = '';
    for (let i = 0; i <= 4; i++) {
      const gy = T + (i / 4) * plotH;
      g += `<line x1="${L}" y1="${gy}" x2="${w - R}" y2="${gy}" stroke="#e8eee9" stroke-width="1"/>`;
      g += `<text x="${L - 8}" y="${gy + 4}" text-anchor="end" font-size="10" fill="#8a9a8e">${Math.round(max - (i / 4) * max)}</text>`;
    }
    labels.forEach((lb, i) => {
      const cx = L + groupW * i + groupW / 2;
      series.forEach((s, si) => {
        const v = Number(s.data[i]) || 0;
        const bh = (v / max) * plotH;
        const bx = cx - (series.length * barW) / 2 + si * barW;
        g += `<rect x="${bx}" y="${T + plotH - bh}" width="${barW - 3}" height="${Math.max(0, bh)}" rx="4" fill="${s.color}"><title>${Utils.esc(s.name)}: ${Utils.esc(v)}</title></rect>`;
      });
      g += `<text x="${cx}" y="${h - 10}" text-anchor="middle" font-size="10" fill="#8a9a8e">${Utils.esc(lb)}</text>`;
    });
    el.innerHTML = this._svg(w, h, g);
  }
};
