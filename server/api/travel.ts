import express from 'express';
import type { TravelConditions } from '../types.js';

const router = express.Router();

// For MVP, we'll return static route info
// In the future, this could scrape Caltrans QuickMap or use their APIs
router.get('/', async (_req, res) => {
  const travelData: TravelConditions = {
    routes: [
      {
        name: 'I-80 to Palisades/Northstar',
        highway: 'I-80',
        status: 'Check Caltrans',
        description: 'Primary route from Bay Area to North Lake Tahoe',
      },
      {
        name: 'US-50 to Heavenly',
        highway: 'US-50',
        status: 'Check Caltrans',
        description: 'Primary route from Bay Area to South Lake Tahoe',
      },
      {
        name: 'CA-88 to Kirkwood',
        highway: 'CA-88',
        status: 'Check Caltrans',
        description: 'Route from Bay Area to Kirkwood',
      },
    ],
    lastUpdated: new Date().toISOString(),
  };

  res.json(travelData);
});

export default router;
