interface GoMeterProps {
  resorts: Array<{
    conditions: {
      snowDepth: {
        newSnow24h: number;
        newSnow48h?: number;
      };
    };
    forecasts: {
      today: any;
      thisWeekend: any[];
    };
  }>;
}

export default function GoMeter({ resorts }: GoMeterProps) {
  if (resorts.length === 0) {
    return (
      <div className="go-meter">
        <div className="meter-display">🟡</div>
        <div className="meter-text">Checking Conditions...</div>
        <div className="meter-description">Analyzing weather and travel data</div>
      </div>
    );
  }

  // Calculate score based on recent snow and forecasts
  const avgSnow24h =
    resorts.reduce((sum, r) => sum + r.conditions.snowDepth.newSnow24h, 0) / resorts.length;
  const avgSnow48h =
    resorts.reduce((sum, r) => sum + (r.conditions.snowDepth.newSnow48h || 0), 0) / resorts.length;

  // Check for snow in upcoming forecasts
  let snowMentions = 0;
  let maxPrecip = 0;

  resorts.forEach((resort) => {
    if (resort.forecasts.today?.conditions?.toLowerCase().includes('snow')) {
      snowMentions++;
    }
    if (resort.forecasts.today?.precipChance) {
      maxPrecip = Math.max(maxPrecip, resort.forecasts.today.precipChance);
    }
    resort.forecasts.thisWeekend?.forEach((f: any) => {
      if (f.conditions?.toLowerCase().includes('snow')) {
        snowMentions++;
      }
      if (f.precipChance) {
        maxPrecip = Math.max(maxPrecip, f.precipChance);
      }
    });
  });

  let emoji: string;
  let text: string;
  let description: string;

  if (avgSnow24h >= 6 || avgSnow48h >= 12 || snowMentions >= 3) {
    emoji = '🟢';
    text = 'Powder Alert!';
    description = 'Fresh snow and great conditions expected';
  } else if (avgSnow24h >= 3 || avgSnow48h >= 6 || snowMentions >= 1 || maxPrecip >= 50) {
    emoji = '🟡';
    text = 'Mixed Conditions';
    description = 'Some snow possible - check individual resorts';
  } else if (avgSnow24h > 0 || maxPrecip >= 30) {
    emoji = '🔵';
    text = 'Light Snow Possible';
    description = 'Check forecasts and road conditions';
  } else {
    emoji = '⚪';
    text = 'Clear Skies';
    description = 'No new snow expected - good for spring skiing';
  }

  return (
    <div className="go-meter">
      <div className="meter-display">{emoji}</div>
      <div className="meter-text">{text}</div>
      <div className="meter-description">{description}</div>
    </div>
  );
}
