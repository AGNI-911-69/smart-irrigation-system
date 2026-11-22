/* ============================================================
   data.js — Reference data for the Smart Irrigation app
   Crop coefficients follow the FAO-56 style approach described
   in the project report (Allen et al., 1998).
   ============================================================ */

const CROPS = [
  { id: 'rice',      name: 'Rice (Paddy)', emoji: '🌾', kc: { init: 1.05, mid: 1.20, end: 0.90 }, rootDepth: 0.50, note: 'Needs standing water in early stages; very water-intensive.' },
  { id: 'wheat',     name: 'Wheat',        emoji: '🌾', kc: { init: 0.50, mid: 1.15, end: 0.40 }, rootDepth: 1.00, note: 'Sensitive to water stress at crown and grain-filling stages.' },
  { id: 'maize',     name: 'Maize (Corn)', emoji: '🌽', kc: { init: 0.50, mid: 1.20, end: 0.60 }, rootDepth: 1.00, note: 'Moderate water need; critical during tasselling.' },
  { id: 'tomato',    name: 'Tomato',       emoji: '🍅', kc: { init: 0.60, mid: 1.15, end: 0.80 }, rootDepth: 0.60, note: 'Regular, even watering prevents fruit cracking.' },
  { id: 'potato',    name: 'Potato',       emoji: '🥔', kc: { init: 0.50, mid: 1.10, end: 0.75 }, rootDepth: 0.60, note: 'Shallow roots; avoid both waterlogging and dryness.' },
  { id: 'sugarcane', name: 'Sugarcane',    emoji: '🎋', kc: { init: 0.40, mid: 1.25, end: 0.75 }, rootDepth: 1.50, note: 'Long-duration crop with high total water demand.' },
  { id: 'cotton',    name: 'Cotton',       emoji: '🌿', kc: { init: 0.45, mid: 1.15, end: 0.70 }, rootDepth: 1.20, note: 'Tolerates some dryness later; sensitive at flowering.' },
  { id: 'soybean',   name: 'Soybean',      emoji: '🫘', kc: { init: 0.45, mid: 1.15, end: 0.60 }, rootDepth: 0.80, note: 'Water stress at pod-fill reduces yield.' },
  { id: 'groundnut', name: 'Groundnut',   emoji: '🥜', kc: { init: 0.45, mid: 1.15, end: 0.65 }, rootDepth: 0.70, note: 'Needs well-drained soil; avoid excess water.' },
  { id: 'mustard',   name: 'Mustard',      emoji: '🌼', kc: { init: 0.45, mid: 1.10, end: 0.45 }, rootDepth: 0.80, note: 'Relatively low water requirement.' }
];

const GROWTH_STAGES = [
  { id: 'init', name: 'Initial / Seedling' },
  { id: 'mid',  name: 'Mid-season / Active growth' },
  { id: 'end',  name: 'Late season / Maturity' }
];

const SOIL_TYPES = [
  { id: 'loamy',  name: 'Loamy (balanced)',  fc: 30, label: 'Holds water well, drains freely' },
  { id: 'clay',   name: 'Clay (heavy)',      fc: 40, label: 'Holds a lot of water, drains slowly' },
  { id: 'sandy',  name: 'Sandy (light)',     fc: 18, label: 'Drains quickly, holds little water' },
  { id: 'silt',   name: 'Silty',             fc: 34, label: 'Good water retention and fertility' }
];

/* WMO weather codes -> description + icon */
const WEATHER_CODES = {
  0:  ['Clear sky', '☀️'],
  1:  ['Mainly clear', '🌤️'],
  2:  ['Partly cloudy', '⛅'],
  3:  ['Overcast', '☁️'],
  45: ['Fog', '🌫️'],
  48: ['Depositing rime fog', '🌫️'],
  51: ['Light drizzle', '🌦️'],
  53: ['Moderate drizzle', '🌦️'],
  55: ['Dense drizzle', '🌧️'],
  56: ['Light freezing drizzle', '🌧️'],
  57: ['Dense freezing drizzle', '🌧️'],
  61: ['Slight rain', '🌦️'],
  63: ['Moderate rain', '🌧️'],
  65: ['Heavy rain', '🌧️'],
  66: ['Light freezing rain', '🌧️'],
  67: ['Heavy freezing rain', '🌧️'],
  71: ['Slight snow', '🌨️'],
  73: ['Moderate snow', '🌨️'],
  75: ['Heavy snow', '❄️'],
  77: ['Snow grains', '🌨️'],
  80: ['Slight rain showers', '🌦️'],
  81: ['Moderate rain showers', '🌧️'],
  82: ['Violent rain showers', '⛈️'],
  85: ['Slight snow showers', '🌨️'],
  86: ['Heavy snow showers', '❄️'],
  95: ['Thunderstorm', '⛈️'],
  96: ['Thunderstorm with hail', '⛈️'],
  99: ['Thunderstorm with heavy hail', '⛈️']
};

function weatherInfo(code) {
  return WEATHER_CODES[code] || ['Unknown conditions', '🌡️'];
}

/* Default locations offered in the location picker */
const DEFAULT_LOCATIONS = [
  { name: 'Kolkata, West Bengal', lat: 22.5726, lon: 88.3639 },
  { name: 'Barrackpore, West Bengal', lat: 22.7053, lon: 88.3550 },
  { name: 'Kalyani, West Bengal', lat: 22.9750, lon: 88.4344 },
  { name: 'New Delhi, Delhi', lat: 28.6139, lon: 77.2090 },
  { name: 'Bengaluru, Karnataka', lat: 12.9716, lon: 77.5946 },
  { name: 'Pune, Maharashtra', lat: 18.5204, lon: 73.8567 },
  { name: 'Hyderabad, Telangana', lat: 17.3850, lon: 78.4867 },
  { name: 'Lucknow, Uttar Pradesh', lat: 26.8467, lon: 80.9462 }
];

/* Demo weather used only when the live API is unreachable */
function demoWeather(location) {
  const today = new Date();
  const days = [];
  const base = 30 + (Math.abs(Math.round(location.lat)) % 5);
  for (let i = 0; i < 7; i++) {
    const d = new Date(today); d.setDate(today.getDate() + i);
    days.push({
      date: d.toISOString().slice(0, 10),
      code: [1, 2, 0, 3, 61, 80, 2][i],
      tmax: base + [1, 2, 3, 0, -2, -1, 1][i],
      tmin: base - 8 + [0, 1, 1, -1, -2, -2, 0][i],
      rain: [0, 0, 0, 1.2, 8.4, 3.1, 0][i],
      rainProb: [10, 20, 10, 40, 80, 60, 20][i],
      et0: 4.2 + [0.2, 0.3, 0.5, -0.3, -1.1, -0.6, 0.1][i]
    });
  }
  return {
    demo: true,
    location: location.name,
    current: { temp: base + 1, humidity: 62, rain: 0, code: 2, wind: 9, time: new Date().toISOString() },
    daily: days
  };
}
