interface ResortCardProps {
  resort: {
    name: string;
    id: string;
    conditions: {
      snowDepth: {
        base: number;
        summit: number;
        newSnow24h: number;
        newSnow48h?: number;
        newSnow7day?: number;
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
  };
}

const RESORT_LINKS: Record<string, { main: string; weather: string; lifts: string }> = {
  palisades: {
    main: 'https://www.palisadestahoe.com/mountain-information/mountain-report',
    weather: 'https://www.palisadestahoe.com/mountain-information/mountain-report',
    lifts: 'https://www.palisadestahoe.com/mountain-information/mountain-report',
  },
  northstar: {
    main: 'https://www.northstarcalifornia.com/the-mountain/mountain-conditions/snow-and-weather-report.aspx',
    weather:
      'https://www.northstarcalifornia.com/the-mountain/mountain-conditions/snow-and-weather-report.aspx',
    lifts:
      'https://www.northstarcalifornia.com/the-mountain/mountain-conditions/terrain-and-lift-status.aspx',
  },
  heavenly: {
    main: 'https://www.skiheavenly.com/the-mountain/mountain-conditions/snow-and-weather-report.aspx',
    weather:
      'https://www.skiheavenly.com/the-mountain/mountain-conditions/snow-and-weather-report.aspx',
    lifts:
      'https://www.skiheavenly.com/the-mountain/mountain-conditions/terrain-and-lift-status.aspx',
  },
  kirkwood: {
    main: 'https://www.kirkwood.com/the-mountain/mountain-conditions/snow-and-weather-report.aspx',
    weather:
      'https://www.kirkwood.com/the-mountain/mountain-conditions/snow-and-weather-report.aspx',
    lifts: 'https://www.kirkwood.com/the-mountain/mountain-conditions/terrain-and-lift-status.aspx',
  },
};

export default function ResortCard({ resort }: ResortCardProps) {
  const links = RESORT_LINKS[resort.id];

  return (
    <div className="resort-card">
      <div className="resort-name">{resort.name}</div>
      <div style={{ marginBottom: '1rem' }}>
        <a href={links.weather} target="_blank" rel="noopener noreferrer" className="resort-link">
          🌨️ Snow & Weather Report →
        </a>
        {links.lifts !== links.weather && (
          <>
            <br />
            <a href={links.lifts} target="_blank" rel="noopener noreferrer" className="resort-link">
              🎿 Terrain & Lift Status →
            </a>
          </>
        )}
      </div>

      <div className="conditions-grid">
        <div className="condition-item">
          <div className="condition-label">24h Snow</div>
          <div className="condition-value">{resort.conditions.snowDepth.newSnow24h}"</div>
        </div>
        <div className="condition-item">
          <div className="condition-label">Base Depth</div>
          <div className="condition-value">{resort.conditions.snowDepth.base}"</div>
        </div>
        <div className="condition-item">
          <div className="condition-label">Current Temp</div>
          <div className="condition-value">{resort.conditions.weather.temp}°F</div>
        </div>
        <div className="condition-item">
          <div className="condition-label">Lifts Open</div>
          <div className="condition-value">
            {resort.conditions.lifts.open}/{resort.conditions.lifts.total}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '6px',
        }}
      >
        <strong>Current:</strong> {resort.conditions.weather.current}
        <br />
        <strong>High/Low:</strong> {resort.conditions.weather.high}°F /{' '}
        {resort.conditions.weather.low}°F
        {resort.conditions.weather.wind && (
          <>
            <br />
            <strong>Wind:</strong> {resort.conditions.weather.wind}
          </>
        )}
      </div>

      {resort.forecasts.today && (
        <div className="forecast-section">
          <h4>Today's Forecast</h4>
          <div
            style={{
              background: 'rgba(0,0,0,0.2)',
              padding: '0.75rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
            }}
          >
            {resort.forecasts.today.conditions || resort.forecasts.today.name}
            {resort.forecasts.today.precipChance > 0 && (
              <> • 💧 {resort.forecasts.today.precipChance}%</>
            )}
          </div>
        </div>
      )}

      {resort.forecasts.thisWeekend?.length > 0 && (
        <div className="forecast-section">
          <h4>This Weekend</h4>
          <div className="forecast-grid-small">
            {resort.forecasts.thisWeekend.slice(0, 2).map((f: any, i: number) => (
              <div key={i} className="forecast-item-small">
                <strong>{f.name}</strong>
                <br />
                {f.high}°F • {f.conditions}
              </div>
            ))}
          </div>
        </div>
      )}

      {resort.forecasts.nextWeekend?.length > 0 && (
        <div className="forecast-section">
          <h4>Next Weekend</h4>
          <div className="forecast-grid-small">
            {resort.forecasts.nextWeekend.slice(0, 2).map((f: any, i: number) => (
              <div key={i} className="forecast-item-small">
                <strong>{f.name}</strong>
                <br />
                {f.high}°F • {f.conditions}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
