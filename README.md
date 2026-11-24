# Smart Irrigation System

**Live Demo:** https://smart-irrigation-phi-silk.vercel.app/

An AI-powered decision-support web application that helps farmers make timely, crop-aware irrigation decisions. Built as an Interdisciplinary Project (IDP) at Adamas University (2026–2027).

---

## Overview

This is a **software prototype** — no sensors, no automated pumps. It combines:
- Crop selection with growth-stage-specific water coefficients (FAO-56 style)
- Live local weather from Open-Meteo (free, no API key)
- Optional soil moisture input for more specific estimates
- Transparent, rule-based water-balance calculations with visible reasoning

---

## Features

| Feature | Description |
|---------|-------------|
| **Farmer accounts** | Register/login to save field details, crop choices, and irrigation history |
| **Crop-aware advice** | 10 crops with stage-specific Kc values (Rice, Wheat, Maize, Tomato, Potato, Sugarcane, Cotton, Soybean, Groundnut, Mustard) |
| **Live weather** | Current conditions + 7-day forecast (temperature, humidity, rainfall, ET₀) |
| **Irrigation guidance** | Clear **Yes / Soon / No** decision with timing and estimated litres |
| **Transparent breakdown** | Every recommendation shows the 5-step calculation |
| **Analytics & history** | Charts for weather trends and saved recommendations |
| **Admin panel** | Manage farmer accounts and crop reference data |

---

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS (no framework, no build step)
- **Weather API:** [Open-Meteo](https://open-meteo.com/) (free, CORS-enabled)
- **Storage:** `localStorage` (browser-only, no backend)
- **Charts:** Lightweight inline SVG (no Chart.js dependency)
- **Deployment:** Vercel (static hosting with SPA rewrites)

---

## Getting Started

### Local Development
```bash
# Clone
git clone https://github.com/AGNI-911-69/smart-irrigation-system.git
cd smart-irrigation-system

# Serve (any static server)
python3 -m http.server 8080
# Open http://localhost:8080/
```

### Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@idp.edu` | `admin123` |
| Farmer | Register a new account | — |

---

## Project Structure

```
├── index.html           # App shell
├── vercel.json          # Vercel SPA rewrites + asset caching
├── assets/
│   ├── css/
│   │   └── styles.css   # Responsive agricultural theme
│   └── js/
│       ├── data.js      # Crops, Kc values, weather codes, demo data
│       ├── services.js  # Storage/auth, weather client, recommendation engine, SVG charts
│       └── app.js       # Routing, all views, event handling
```

---

## How the Recommendation Works

A transparent FAO-56-style water balance:

1. **Crop water use** = ET₀ × Kc (mm/day)
2. **Less effective rainfall** (forecast over 2 days, capped at crop need)
3. **Soil moisture adjustment** (if provided — scales need from 0.15× to 1.0×)
4. **Application efficiency** (default 80% → gross mm = net / 0.8)
5. **Field area** → litres (1 mm × 1 m² = 1 L)

The UI shows every step so farmers can verify the reasoning.

---

## Disclaimer

> This is a planning-stage student prototype. Recommendations are **estimates** based on weather forecasts and simplified crop models. They should be combined with local farming knowledge, field observations, and expert advice. The system does **not** replace agricultural expertise or field verification.

---

## License

MIT — feel free to use, modify, and learn from this project.

---

## Acknowledgments

- Open-Meteo for free weather API
- FAO-56 methodology reference (Allen et al., 1998)
- Adamas University — Interdisciplinary Project 2026–2027