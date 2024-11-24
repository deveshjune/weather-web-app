import React from 'react'
import { getWeatherIcon } from './WeatherNow'
 
// weather forecast of popular cities
export default function CityPanel({ cities }) {
    return (
      <div className="city-panel">
        {cities.map(({ name, forecast, currentWeather }) => (
          <div key={name} className="forecast-card">
            <h3>{name}</h3>
            <p className="current-weather">
              {getWeatherIcon(currentWeather.weathercode)} {currentWeather.temperature}°C
            </p>
            <p>Max: {forecast.temperature_2m_max[0]}°C</p>
            <p>Min: {forecast.temperature_2m_min[0]}°C</p>
            <p>Precipitation: {forecast.precipitation_sum[0]} mm</p>
            <p>Max Wind Speed: {forecast.windspeed_10m_max[0]} km/h</p>
          </div>
        ))}
      </div>
    )
  }