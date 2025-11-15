import { useEffect, useState } from 'react'

interface Period {
  name: string
  temperature: number
  temperatureUnit: string
  windSpeed: string
  shortForecast: string
  probabilityOfPrecipitation: number
  startTime: string
}

interface OrganizedForecast {
  todayTomorrow: Period[]
  thisWeekend: Period[]
  nextWeekend: Period[]
}

export default function WeatherSummary() {
  const [forecast, setForecast] = useState<OrganizedForecast>({
    todayTomorrow: [],
    thisWeekend: [],
    nextWeekend: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/weather')
      .then((res) => res.json())
      .then((data) => {
        const periods: Period[] = data.periods || []
        const organized = organizeForecast(periods)
        setForecast(organized)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching weather:', err)
        setLoading(false)
      })
  }, [])

  const organizeForecast = (periods: Period[]): OrganizedForecast => {
    const now = new Date()
    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const result: OrganizedForecast = {
      todayTomorrow: [],
      thisWeekend: [],
      nextWeekend: [],
    }

    // Helper to get date without time
    const getDateOnly = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

    // Calculate this Friday and next Friday
    const currentDayOfWeek = now.getDay() // 0 = Sunday, 6 = Saturday

    // Days until Friday (5 = Friday)
    let daysUntilFriday = (5 - currentDayOfWeek + 7) % 7
    if (currentDayOfWeek === 5) {
      // It's Friday - check if we've passed Friday evening (6pm)
      daysUntilFriday = now.getHours() >= 18 ? 7 : 0
    }

    const thisFriday = new Date(nowDateOnly)
    thisFriday.setDate(thisFriday.getDate() + daysUntilFriday)

    const thisSunday = new Date(thisFriday)
    thisSunday.setDate(thisSunday.getDate() + 2) // Sunday

    const nextFriday = new Date(thisFriday)
    nextFriday.setDate(nextFriday.getDate() + 7)

    const nextSunday = new Date(nextFriday)
    nextSunday.setDate(nextSunday.getDate() + 2)

    const tomorrow = new Date(nowDateOnly)
    tomorrow.setDate(tomorrow.getDate() + 1)

    periods.forEach((period) => {
      const periodDate = new Date(period.startTime)
      const periodDateOnly = getDateOnly(periodDate)

      // Today & Tomorrow - show periods from today and tomorrow only
      if (periodDateOnly.getTime() === nowDateOnly.getTime() ||
          periodDateOnly.getTime() === tomorrow.getTime()) {
        result.todayTomorrow.push(period)
      }

      // This Weekend - Friday night through Sunday night
      // Weekend starts on Friday evening, so include periods from Friday onwards
      if (periodDateOnly.getTime() >= thisFriday.getTime() &&
          periodDateOnly.getTime() <= thisSunday.getTime()) {
        // Also check if it's a Friday period that it's evening/night
        const periodName = period.name.toLowerCase()
        if (periodDateOnly.getTime() === thisFriday.getTime()) {
          // Only include if it's afternoon/evening/night on Friday
          if (periodName.includes('night') || periodName.includes('evening') || periodName.includes('afternoon')) {
            result.thisWeekend.push(period)
          }
        } else {
          result.thisWeekend.push(period)
        }
      }

      // Next Weekend - Friday night through Sunday night of following week
      if (periodDateOnly.getTime() >= nextFriday.getTime() &&
          periodDateOnly.getTime() <= nextSunday.getTime()) {
        const periodName = period.name.toLowerCase()
        if (periodDateOnly.getTime() === nextFriday.getTime()) {
          // Only include if it's afternoon/evening/night on Friday
          if (periodName.includes('night') || periodName.includes('evening') || periodName.includes('afternoon')) {
            result.nextWeekend.push(period)
          }
        } else {
          result.nextWeekend.push(period)
        }
      }
    })

    return result
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' })
    return `${weekday} ${month}/${day}`
  }

  const renderPeriods = (periods: Period[]) => {
    return periods.map((period, index) => (
      <div key={index} className="forecast-item">
        <div className="forecast-name">{period.name}</div>
        <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.5rem' }}>
          {formatDate(period.startTime)}
        </div>
        <div className="forecast-temp">
          {period.temperature}°{period.temperatureUnit}
        </div>
        <div className="forecast-desc">{period.shortForecast}</div>
        {period.probabilityOfPrecipitation > 0 && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            💧 {period.probabilityOfPrecipitation}%
          </div>
        )}
      </div>
    ))
  }

  return (
    <>
      <h2 className="section-header">
        Weather Forecast
        <a
          href="https://forecast.weather.gov/MapClick.php?lat=39.1911&lon=-120.2359"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginLeft: '1rem',
            fontSize: '0.875rem',
            color: '#64b5f6',
            textDecoration: 'none',
            fontWeight: 'normal'
          }}
        >
          View on Weather.gov →
        </a>
      </h2>
      <div className="weather-summary">
        {loading ? (
          <div className="loading">Loading forecast...</div>
        ) : (
          <>
            {forecast.todayTomorrow.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', opacity: 0.9 }}>Today & Tomorrow</h3>
                <div className="forecast-grid">{renderPeriods(forecast.todayTomorrow)}</div>
              </div>
            )}

            {forecast.thisWeekend.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', opacity: 0.9 }}>This Weekend</h3>
                <div className="forecast-grid">{renderPeriods(forecast.thisWeekend)}</div>
              </div>
            )}

            {forecast.nextWeekend.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', opacity: 0.9 }}>Next Weekend</h3>
                <div className="forecast-grid">{renderPeriods(forecast.nextWeekend)}</div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
