Perfect — **Tahoe-Meter** is a great name: short, fun, memorable, and visually fits a “dashboard gauge” aesthetic.

Here’s a **concrete MVP feature list** for a **static, client-side only** single-page app that a junior dev could build fast, **no backend, no API keys** — relying on public embeddable data (e.g. iframes, RSS, JSON endpoints, weather.gov, etc.).

---

## 🧭 Overall MVP Goals

- Zero backend / hosting = pure HTML + CSS + JS (or a simple React/Vite SPA)
- All data pulled from **public APIs or iframes** without API keys
- Focus on **visual clarity + immediate “should we go?” insight**
- Should update automatically every few minutes (via client-side refresh)
- Layout: **one-page dashboard** with modular cards for each data source

---

## 🏔 Resort Conditions (Main Section)

Each major Tahoe resort gets its own “card” with current and short-term forecasts.

- **Resorts covered**: Palisades/Alpine, Northstar, Heavenly, Kirkwood
- For each:

  - Resort name + logo
  - Link to official resort conditions page (e.g. palisadestahoe.com/mountain-conditions)
  - **Iframe or embed of weather.gov forecast** (no key required):

    - Example: `https://forecast.weather.gov/MapClick.php?lat=39.1911&lon=-120.2359&unit=0&lg=english&FcstType=text&TextType=2`
    - or the JSON endpoint: `https://api.weather.gov/points/{lat},{lon}` → fetch forecast

  - **Snowfall summary**:

    - 24-hr snowfall (if shown in resort’s conditions iframe)
    - 7-day snowfall forecast (from weather.gov)

  - **Temperature + Wind summary** (just icons and numbers)
  - “Conditions last updated” timestamp

_(Optional early enhancement: color-code or iconize conditions — 🟢 good snow, 🟡 mixed, 🔴 icy.)_

---

## 🚗 Travel Conditions (Bay Area → Tahoe)

### 1. **Driving Time Estimates**

- Use public Google Maps “embed” URLs (no API key required):

  - Example:

    ```html
    <iframe
      src="https://www.google.com/maps/embed/v1/directions?origin=San+Francisco,+CA&destination=Kirkwood+Mountain+Resort,+CA"
      allowfullscreen
    ></iframe>
    ```

  - Or simpler: a text link to the “directions” view for each resort.

_(API key required for dynamic distance/time via JS, so MVP can just link out or show static embeds.)_

### 2. **Caltrans Road Conditions**

- Directly embed or link to live chain control / closure maps:

  - [Caltrans QuickMap](https://quickmap.dot.ca.gov/)
  - Embed example:

    ```html
    <iframe
      src="https://quickmap.dot.ca.gov"
      width="100%"
      height="400"
    ></iframe>
    ```

  - Also include text links to road status pages for:

    - **I-80** (SF → Northstar / Palisades)
    - **US-50** (SF → Heavenly)
    - **CA-88** (SF → Kirkwood)

### 3. **Snow Chain / Closure Summary (text)**

- Include a section with prefilled Caltrans URLs:

  - I-80 chain control summary
  - US-50 chain control summary
  - CA-88 chain control summary
  - These can open in a new tab.

---

## 🌦 Weather Summary (Cross-Resort Overview)

- Small section with a **7-day forecast summary** (from weather.gov)
- Use weather.gov API directly (JSON — no API key):

  - Example fetch:

    ```js
    fetch('https://api.weather.gov/gridpoints/STO/77,57/forecast')
      .then(r => r.json())
      .then(data => /* show periods[0..5] with temperature + shortForecast */)
    ```

- Display:

  - “Today / Tonight / Tomorrow / Weekend”
  - Temperature highs/lows and forecast icons
  - Precipitation chance (%)

---

## 🧊 “Go Meter” Summary Widget

A single, big visual element at the top summarizing the weekend conditions.

- Combines rough logic like:

  - Recent snowfall + upcoming snowfall + travel open roads
  - Use emojis or a dial meter (SVG) for fun:
    🟢 “Powder Alert” → recent snow + low traffic
    🟡 “Mixed Bag” → some snow + possible chain control
    🔴 “Stay Home” → no new snow or roads closed

- Can be manually tuned at first — no real algorithm yet.

---

## 🧭 Layout & Navigation

- **Sticky header** with logo “Tahoe-Meter ❄️”
- **Sections:** Overview Meter → Resort Cards → Travel Conditions → Weather Summary
- Responsive layout (2-column on desktop, single-column on mobile)
- Simple CSS theme: dark background, snow/blue accent palette

---

## 📦 Stretch Features (Future Iteration)

- User location auto-detect (for ETA personalization)
- Add snowfall history charts (pull from open resort RSS or Snow-Forecast.com embeds)
- Local webcams embeds (Palisades, Caltrans)
- “Next weekend” vs “This weekend” tabs
- Offline caching with PWA manifest

---

### ✅ TL;DR — Immediate MVP Feature Checklist

**Core**

- [ ] Four resort cards (weather.gov embed + resort conditions link)
- [ ] Caltrans QuickMap iframe
- [ ] Direct links to chain control pages
- [ ] Google Maps iframes or links for driving routes
- [ ] Top “Go Meter” summary banner
- [ ] Basic styling (dark mode, responsive)

**Optional Easy Adds**

- [ ] Auto-refresh every 5–10 min
- [ ] Simple weekend forecast summary from weather.gov JSON
- [ ] Embed a couple of resort webcams

---

Would you like me to turn this into a **starter folder structure** (HTML/CSS/JS or Vite + React) with placeholders and data fetches already stubbed out, so your junior dev can clone it and fill in API details?
