import React from 'react'
import { getWeatherIcon } from './WeatherNow'
 
// Component to display weather forecast of popular cities
export default function CityPanel({ cities }) {
    return (
      <div className="city-panel">
        {/* Map through each city and display its weather information */}
        {cities.map(({ name, forecast, currentWeather }) => (
          <div key={name} className="forecast-card">
            <h3>{name}</h3>
            {/* Display current weather with icon */}
            <p className="current-weather">
              {getWeatherIcon(currentWeather.weathercode)} {currentWeather.temperature}°C
            </p>
            {/* Display forecast information */}
            <p>Max: {forecast.temperature_2m_max[0]}°C</p>
            <p>Min: {forecast.temperature_2m_min[0]}°C</p>
            <p>Precipitation: {forecast.precipitation_sum[0]} mm</p>
            <p>Max Wind Speed: {forecast.windspeed_10m_max[0]} km/h</p>
          </div>
        ))}
      </div>
    )
  }

