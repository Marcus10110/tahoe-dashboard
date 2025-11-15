import express from 'express';
import NodeCache from 'node-cache';

const router = express.Router();
const cache = new NodeCache({ stdTTL: 600 }); // 10 minute cache

// General Tahoe area forecast (using Palisades location)
const TAHOE_LAT = 39.1911;
const TAHOE_LON = -120.2359;

router.get('/', async (req, res) => {
  const cached = cache.get('generalForecast');
  if (cached) {
    return res.json(cached);
  }

  try {
    const pointResponse = await fetch(
      `https://api.weather.gov/points/${TAHOE_LAT},${TAHOE_LON}`,
      { headers: { 'User-Agent': 'TahoeMeter/1.0' } }
    );
    const pointData = await pointResponse.json();

    const forecastResponse = await fetch(pointData.properties.forecast, {
      headers: { 'User-Agent': 'TahoeMeter/1.0' },
    });
    const forecastData = await forecastResponse.json();

    // Weather.gov typically provides 14 periods (7 days), but we need more for next weekend
    // Take up to 20 periods to cover ~10 days
    const periods = forecastData.properties.periods.slice(0, 20).map((period: any) => ({
      name: period.name,
      temperature: period.temperature,
      temperatureUnit: period.temperatureUnit,
      windSpeed: period.windSpeed,
      shortForecast: period.shortForecast,
      detailedForecast: period.detailedForecast,
      probabilityOfPrecipitation: period.probabilityOfPrecipitation?.value || 0,
      startTime: period.startTime,
    }));

    const result = {
      periods,
      lastUpdated: new Date().toISOString(),
    };

    cache.set('generalForecast', result);
    res.json(result);
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

export default router;
