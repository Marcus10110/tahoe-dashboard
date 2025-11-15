import express from 'express';
import NodeCache from 'node-cache';
import type { ResortConditions, Forecast } from '../types.js';

const router = express.Router();
const cache = new NodeCache({ stdTTL: 600 }); // 10 minute cache

const RESORTS = {
  palisades: {
    name: 'Palisades Tahoe',
    configUrl: 'https://v4.mtnfeed.com/resorts/palisades-tahoe.json',
    lat: 39.1911,
    lon: -120.2359,
  },
  heavenly: {
    name: 'Heavenly',
    apiUrl: 'https://www.skiheavenly.com/api/PageApi/GetWeatherDataForHeader',
    lat: 38.9352,
    lon: -119.9392,
  },
  kirkwood: {
    name: 'Kirkwood',
    apiUrl: 'https://www.kirkwood.com/api/PageApi/GetWeatherDataForHeader',
    lat: 38.684,
    lon: -120.0664,
  },
  northstar: {
    name: 'Northstar',
    apiUrl: 'https://www.northstarcalifornia.com/api/PageApi/GetWeatherDataForHeader',
    lat: 39.2734,
    lon: -120.1218,
  },
};

// Get weather.gov forecast for a location
async function getWeatherGovForecast(lat: number, lon: number): Promise<Forecast[]> {
  try {
    const pointResponse = await fetch(`https://api.weather.gov/points/${lat},${lon}`, {
      headers: { 'User-Agent': 'TahoeMeter/1.0' },
    });
    const pointData = (await pointResponse.json()) as any;

    const forecastResponse = await fetch(pointData.properties.forecast, {
      headers: { 'User-Agent': 'TahoeMeter/1.0' },
    });
    const forecastData = (await forecastResponse.json()) as any;

    return forecastData.properties.periods.map((period: any) => ({
      date: period.startTime,
      name: period.name,
      high: period.temperature,
      low: period.temperature,
      conditions: period.shortForecast,
      precipChance: period.probabilityOfPrecipitation?.value || 0,
    }));
  } catch (error) {
    console.error('Error fetching weather.gov forecast:', error);
    return [];
  }
}

// Parse Palisades data (mtnpowder format)
async function fetchPalisadesData(): Promise<ResortConditions> {
  try {
    // First, fetch config to get bearer token and resort IDs
    const configResponse = await fetch(RESORTS.palisades.configUrl);
    if (!configResponse.ok) {
      const text = await configResponse.text();
      console.error(`[palisades] Config API returned status ${configResponse.status}`);
      console.error(`[palisades] Response body (first 500 chars):`, text.substring(0, 500));
      throw new Error(`Failed to fetch Palisades config`);
    }
    const config = (await configResponse.json()) as any;

    const bearerToken = config.bearerToken;
    const resortIds = config.resortIds || [61]; // fallback to 61 if not found

    // Now fetch actual data using the bearer token and resort IDs
    const resortIdParams = resortIds.map((id: number) => `resortId%5B%5D=${id}`).join('&');
    const dataUrl = `https://mtnpowder.com/feed/v3.json?bearer_token=${bearerToken}&${resortIdParams}`;

    const response = await fetch(dataUrl);
    if (!response.ok) {
      const text = await response.text();
      console.error(`[palisades] Data API returned status ${response.status}`);
      console.error(`[palisades] Response body (first 500 chars):`, text.substring(0, 500));
      throw new Error(`Failed to fetch Palisades data`);
    }
    const data = (await response.json()) as any;
    console.log('data', data);
    // Extract resort data (should be first item in Resorts array)
    const resort = data.Resorts?.[0];
    const snowReport = resort?.SnowReport;
    const currentConditions = resort?.CurrentConditions;
    const currentBaseConditions = currentConditions?.Base;

    console.log(currentConditions, currentBaseConditions);

    // Get weather.gov forecast for temp/conditions since API doesn't provide current weather
    const forecasts = await getWeatherGovForecast(RESORTS.palisades.lat, RESORTS.palisades.lon);

    return {
      name: RESORTS.palisades.name,
      id: 'palisades',
      conditions: {
        snowDepth: {
          base: parseInt(snowReport?.BaseArea?.BaseIn || '0'),
          summit: parseInt(snowReport?.SummitArea?.BaseIn || '0'),
          newSnow24h: parseInt(snowReport?.Last24HoursIn || '0'),
          newSnow48h: parseInt(snowReport?.Last48HoursIn || '0'),
          newSnow7day: parseInt(snowReport?.Last7DaysIn || '0'),
        },
        weather: {
          current: currentBaseConditions?.Skies || 'See forecast',
          temp: currentBaseConditions?.TemperatureF || 0,
          high: currentBaseConditions?.TemperatureHighF || 0,
          low: currentBaseConditions?.TemperatureLowF || 0,
          wind: `${currentBaseConditions?.WindDirection ?? '-'} ${
            currentBaseConditions?.WindStrengthMph || '-'
          }-${currentBaseConditions?.WindGustsMph || '-'} mph`,
        },
        lifts: {
          open: snowReport?.TotalOpenLifts || 0,
          total: snowReport?.TotalLifts || 0,
        },
        trails: {
          open: snowReport?.TotalOpenTrails || 0,
          total: snowReport?.TotalTrails || 0,
        },
      },
      forecasts: {
        today: forecasts[0] || ({} as Forecast),
        thisWeekend: getWeekendForecasts(forecasts, false),
        nextWeekend: getWeekendForecasts(forecasts, true),
      },
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[palisades] Error fetching data:', error);
    throw error;
  }
}

// Parse Vail Resorts data (Heavenly, Kirkwood, Northstar)
async function fetchVailResortData(resortId: keyof typeof RESORTS): Promise<ResortConditions> {
  const resort = RESORTS[resortId];

  // Type guard to ensure resort has apiUrl
  if (!('apiUrl' in resort)) {
    throw new Error(`Resort ${resortId} does not have an apiUrl`);
  }

  const timestamp = Date.now();
  const response = await fetch(`${resort.apiUrl}?_=${timestamp}`, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      Referer: resort.apiUrl.split('/api/')[0],
      Origin: resort.apiUrl.split('/api/')[0],
    },
  });

  // Check if response is OK and is JSON
  if (!response.ok) {
    const text = await response.text();
    console.error(`[${resortId}] API returned status ${response.status}`);
    console.error(`[${resortId}] Response body (first 500 chars):`, text.substring(0, 500));
    throw new Error(`Resort API returned status ${response.status} for ${resortId}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error(`[${resortId}] Expected JSON but got content-type: ${contentType}`);
    console.error(`[${resortId}] Response body (first 500 chars):`, text.substring(0, 500));
    throw new Error(`Resort API returned non-JSON response for ${resortId}`);
  }

  const data = (await response.json()) as any;

  const forecasts = await getWeatherGovForecast(resort.lat, resort.lon);

  return {
    name: resort.name,
    id: resortId,
    conditions: {
      snowDepth: {
        base: data.BaseDepthStandard || 0,
        summit: data.BaseDepthStandard || 0, // Vail API doesn't differentiate
        newSnow24h: data.TwentyFourHourSnowfallStandard || 0,
      },
      weather: {
        current: data.WeatherShortDescription || 'Unknown',
        temp: data.CurrentTempStandard || 0,
        high: data.HighTempStandard || 0,
        low: data.LowTempStandard || 0,
      },
      lifts: {
        open: data.OpenLifts || 0,
        total: data.TotalLifts || 0,
      },
    },
    forecasts: {
      today: forecasts[0] || ({} as Forecast),
      thisWeekend: getWeekendForecasts(forecasts, false),
      nextWeekend: getWeekendForecasts(forecasts, true),
    },
    lastUpdated: new Date().toISOString(),
  };
}

// Helper to extract weekend forecasts
function getWeekendForecasts(forecasts: Forecast[], nextWeekend: boolean): Forecast[] {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday

  let daysUntilSaturday = (6 - currentDay + 7) % 7;
  if (daysUntilSaturday === 0 && now.getHours() > 12) {
    daysUntilSaturday = 7; // If it's Saturday afternoon, look to next weekend
  }

  if (nextWeekend) {
    daysUntilSaturday += 7;
  }

  // Find Saturday and Sunday in forecasts
  const targetDate = new Date(now);
  targetDate.setDate(targetDate.getDate() + daysUntilSaturday);

  return forecasts.filter((f) => {
    const forecastDate = new Date(f.date);
    const diffDays = Math.floor((forecastDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (nextWeekend) {
      return diffDays >= daysUntilSaturday && diffDays <= daysUntilSaturday + 1;
    } else {
      return diffDays >= daysUntilSaturday - 7 && diffDays <= daysUntilSaturday - 6;
    }
  });
}

// GET /api/resorts/:resortId
router.get('/:resortId', async (req, res) => {
  const resortId = req.params.resortId as keyof typeof RESORTS;

  if (!RESORTS[resortId]) {
    return res.status(404).json({ error: 'Resort not found' });
  }

  // Check cache
  const cached = cache.get<ResortConditions>(resortId);
  if (cached) {
    return res.json(cached);
  }

  try {
    let data: ResortConditions;

    if (resortId === 'palisades') {
      data = await fetchPalisadesData();
    } else {
      data = await fetchVailResortData(resortId);
    }

    cache.set(resortId, data);
    res.json(data);
  } catch (error) {
    console.error(`Error fetching ${resortId} data:`, error);
    res.status(500).json({ error: 'Failed to fetch resort data' });
  }
});

// GET /api/resorts - Get all resorts
router.get('/', async (_req, res) => {
  try {
    const resortIds = Object.keys(RESORTS) as (keyof typeof RESORTS)[];
    const results = await Promise.allSettled(
      resortIds.map(async (id) => {
        const cached = cache.get<ResortConditions>(id);
        if (cached) return cached;

        try {
          const data =
            id === 'palisades' ? await fetchPalisadesData() : await fetchVailResortData(id);
          cache.set(id, data);
          return data;
        } catch (error) {
          console.error(`Failed to fetch ${id}:`, error);
          throw error;
        }
      })
    );

    // Filter out failed resorts and return successful ones
    const allData = results
      .filter(
        (result): result is PromiseFulfilledResult<ResortConditions> =>
          result.status === 'fulfilled'
      )
      .map((result) => result.value);

    // If all resorts failed, return an error
    if (allData.length === 0) {
      return res.status(500).json({ error: 'Failed to fetch any resort data' });
    }

    res.json(allData);
  } catch (error) {
    console.error('Error fetching all resorts:', error);
    res.status(500).json({ error: 'Failed to fetch resort data' });
  }
});

export default router;
