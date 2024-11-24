

import React, { useState, useEffect } from 'react'
import CityPanel from './CityPanel'
import './WeatherNow.css'


export function getWeatherIcon (weatherCode) {
  if (weatherCode <= 3) return '☀️'
  if (weatherCode <= 48) return '☁️'
  if (weatherCode <= 67) return '🌧️'
  if (weatherCode <= 77) return '❄️'
  return '⛈️'
}

export default function WeatherNow() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [defaultCities, setDefaultCities] = useState([])

  useEffect(() => {
    const fetchDefaultCities = async () => {
      const cities = ['Delhi', 'New York', 'Mumbai', 'Kolkata']
      const fetchedCities = await Promise.all(
        cities.map(async (cityName) => {
          const { latitude, longitude } = await fetchCoordinates(cityName)
          const forecast = await fetchForecast(latitude, longitude)
          const currentWeather = await fetchCurrentWeather(latitude, longitude)
          return { name: cityName, forecast, currentWeather }
        })
      )
      setDefaultCities(fetchedCities)
    }

    fetchDefaultCities()
  }, [])

  //API for forecast functionality
  const fetchCoordinates = async (cityName) => {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`)
    const data = await response.json()
    return data.results[0]
  }

  const fetchForecast = async (latitude, longitude) => {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto`)
    const data = await response.json()
    return data.daily
  }

  const fetchCurrentWeather = async (latitude, longitude) => {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`)
    const data = await response.json()
    return data.current_weather
  }

  const fetchWeather = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setWeather(null)
    setForecast(null)

    try {
      const { latitude, longitude } = await fetchCoordinates(city)
      const weatherData = await fetchCurrentWeather(latitude, longitude)
      const forecastData = await fetchForecast(latitude, longitude)

      setWeather(weatherData)
      setForecast(forecastData)
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  
  const handleBack = () => {
    setCity('')
    setWeather(null)
    setForecast(null)
    setError('')
  }

  return (
    <div className="weather-now">
      <h1>Weather Now</h1>
      <form onSubmit={fetchWeather}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {(weather || forecast) && (
        <button onClick={handleBack} className="back-button">
          Back to Home
        </button>
      )}

      {weather && forecast && (
        <div className="weather-info">
          <h2>Weather in {city}</h2>
          <p className="current-weather">
            {getWeatherIcon(weather.weathercode)} {weather.temperature}°C
          </p>
          <p>Wind Speed: {weather.windspeed} km/h</p>
          <p>Wind Direction: {weather.winddirection}°</p>
          <h3>Today's Forecast</h3>
          <p>Max: {forecast.temperature_2m_max[0]}°C</p>
          <p>Min: {forecast.temperature_2m_min[0]}°C</p>
          <p>Precipitation: {forecast.precipitation_sum[0]} mm</p>
          <p>Max Wind Speed: {forecast.windspeed_10m_max[0]} km/h</p>
        </div>
      )}

      {!weather && !forecast && defaultCities.length > 0 && (
        <>
          <h2>Popular Cities</h2>
          <CityPanel cities={defaultCities} />
        </>
      )}
    </div>
  )
}
