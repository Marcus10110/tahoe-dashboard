import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import resortsRouter from './api/resorts.js';
import weatherRouter from './api/weather.js';
import travelRouter from './api/travel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/resorts', resortsRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/travel', travelRouter);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../client');
  app.use(express.static(clientPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
