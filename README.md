# Tahoe-Meter ❄️

A real-time Lake Tahoe ski conditions dashboard that aggregates data from multiple resorts and provides intelligent "should we go?" recommendations.

## Features

- **Live Resort Conditions** - Current snow depth, weather, lift status for Palisades, Northstar, Heavenly, and Kirkwood
- **Smart "Go Meter"** - Analyzes conditions across all resorts to give you an at-a-glance recommendation
- **Weekend Forecasts** - See conditions for this weekend and next weekend
- **Travel Conditions** - Integrated Caltrans road conditions and chain control info
- **Auto-refresh** - Updates every 10 minutes automatically

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express + TypeScript
- **Data Sources**:
  - Palisades: mtnfeed.com API
  - Vail Resorts (Heavenly/Kirkwood/Northstar): Official APIs
  - Weather: weather.gov API
  - Travel: Caltrans QuickMap

## Local Development

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
# Install dependencies
npm install

# Start development server (runs frontend + backend concurrently)
npm run dev
```

This will start:
- Frontend dev server at `http://localhost:3000`
- Backend API server at `http://localhost:3001`

The frontend proxies API requests to the backend automatically.

## Building for Production

```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

This will:
1. Build the React app to `dist/client`
2. Compile TypeScript backend to `dist/server`
3. Start the Express server which serves both the API and static files

## Deployment

### Render.com (Recommended Free Host)

1. Create a new **Web Service** on Render.com
2. Connect your GitHub repository
3. Configure the service:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node

4. Deploy!

The app will be available at your Render URL.

### Other Platforms

The app is a standard Node.js Express app and can be deployed to:
- Railway.app
- Fly.io
- Heroku
- Any platform that supports Node.js

Just ensure:
- `NODE_ENV=production` is set
- Build command runs `npm install && npm run build`
- Start command runs `npm start`

## API Endpoints

### `GET /api/resorts`
Returns all resort conditions and forecasts.

### `GET /api/resorts/:resortId`
Returns conditions for a specific resort (palisades, northstar, heavenly, kirkwood).

### `GET /api/weather`
Returns 7-day general Tahoe area forecast from weather.gov.

### `GET /api/travel`
Returns travel route information.

## Project Structure

```
tahoe-dashboard/
├── src/                    # Frontend React code
│   ├── components/         # React components
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # React entry point
│   └── index.css          # Global styles
├── server/                 # Backend Express code
│   ├── api/               # API route handlers
│   │   ├── resorts.ts    # Resort data endpoints
│   │   ├── weather.ts    # Weather forecast endpoint
│   │   └── travel.ts     # Travel conditions endpoint
│   ├── types.ts          # Shared TypeScript types
│   └── index.ts          # Express server entry
├── dist/                  # Build output (gitignored)
│   ├── client/           # Built React app
│   └── server/           # Compiled backend
├── package.json
├── tsconfig.json         # Frontend TS config
├── tsconfig.server.json  # Backend TS config
└── vite.config.ts       # Vite configuration
```

## Development Notes

- Backend uses a 10-minute cache (via `node-cache`) to avoid hammering resort APIs
- All resort APIs are public and don't require authentication
- The app is fully client-server separated for easy scaling
- TypeScript provides type safety across the entire stack

## License

MIT
