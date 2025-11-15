import { useEffect, useState } from 'react';
import ResortCard from './components/ResortCard';
import GoMeter from './components/GoMeter';
import TravelConditions from './components/TravelConditions';
import WeatherSummary from './components/WeatherSummary';

interface ResortData {
  name: string;
  id: string;
  conditions: {
    snowDepth: {
      base: number;
      summit: number;
      newSnow24h: number;
      newSnow48h?: number;
      newSnow7day?: number;
      seasonTotal?: number;
    };
    weather: {
      current: string;
      temp: number;
      high: number;
      low: number;
      wind?: string;
    };
    lifts: {
      open: number;
      total: number;
    };
    trails?: {
      open: number;
      total: number;
    };
  };
  forecasts: {
    today: any;
    thisWeekend: any[];
    nextWeekend: any[];
  };
  lastUpdated: string;
}

function App() {
  const [resorts, setResorts] = useState<ResortData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/resorts');
      if (!response.ok) throw new Error('Failed to fetch resort data');
      const data = await response.json();
      setResorts(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header>
        <div className="container">
          <div className="header-content">
            <h1>
              Tahoe-Meter ❄️
              <a
                href="https://github.com/Marcus10110/tahoe-dashboard"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginLeft: '1rem',
                  fontSize: '0.875rem',
                  color: '#64b5f6',
                  textDecoration: 'none',
                  fontWeight: 'normal',
                }}
              >
                GitHub →
              </a>
            </h1>
            <div className="last-updated">Updated: {lastUpdated.toLocaleString()}</div>
          </div>
        </div>
      </header>

      <div className="container">
        <GoMeter resorts={resorts} />

        <h2 className="section-header">Resort Conditions</h2>
        {loading && <div className="loading">Loading resort data...</div>}
        {error && <div className="error">Error: {error}</div>}
        {!loading && !error && (
          <div className="resort-grid">
            {resorts.map((resort) => (
              <ResortCard key={resort.id} resort={resort} />
            ))}
          </div>
        )}

        <TravelConditions />
        <WeatherSummary />
      </div>
    </>
  );
}

export default App;
