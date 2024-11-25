import React, { useState, useEffect } from 'react'
import CityPanel from './CityPanel'
import './WeatherNow.css'

// Helper function to determine weather icon based on weather code
export function getWeatherIcon(weatherCode) {
  if (weatherCode >= 0 && weatherCode <= 1) return '☀️'; // Clear sky
  if (weatherCode === 2) return '🌤️'; // Partly cloudy
  if (weatherCode === 3) return '☁️'; // Overcast
  if (weatherCode >= 45 && weatherCode <= 48) return '🌫️'; // Fog
  if (weatherCode >= 51 && weatherCode <= 55) return '🌧️'; // Drizzle
  if (weatherCode >= 56 && weatherCode <= 57) return '🌨️'; // Freezing Drizzle
  if (weatherCode >= 61 && weatherCode <= 65) return '🌧️'; // Rain
  if (weatherCode >= 66 && weatherCode <= 67) return '🌨️'; // Freezing Rain
  if (weatherCode >= 71 && weatherCode <= 77) return '❄️'; // Snow
  if (weatherCode >= 80 && weatherCode <= 82) return '🌦️'; // Rain showers
  if (weatherCode >= 85 && weatherCode <= 86) return '🌨️'; // Snow showers
  if (weatherCode >= 95 && weatherCode <= 99) return '⛈️'; // Thunderstorm
  return '❓'; // Unknown weather code
}

export default function WeatherNow() {
  // State variables
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [defaultCities, setDefaultCities] = useState([])

  // Fetch weather data for default cities on component mount
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

  // API function to fetch coordinates for a given city
  const fetchCoordinates = async (cityName) => {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`)
    const data = await response.json()
    return data.results[0]
  }

  // API function to fetch forecast data
  const fetchForecast = async (latitude, longitude) => {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto`)
    const data = await response.json()
    return data.daily
  }

  // API function to fetch current weather data
  const fetchCurrentWeather = async (latitude, longitude) => {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`)
    const data = await response.json()
    return data.current_weather
  }

  // Function to handle weather search
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

  // Function to handle back button click
  const handleBack = () => {
    setCity('')
    setWeather(null)
    setForecast(null)
    setError('')
  }

  return (
    <div className="weather-now">
      <h1>Weather Now</h1>
      {/* Search form */}
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

      {/* Error message */}
      {error && <p className="error">{error}</p>}

      {/* Back button */}
      {(weather || forecast) && (
        <button onClick={handleBack} className="back-button">
          Back to Home
        </button>
      )}

      {/* Weather information */}
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

      {/* Default cities panel */}
      {!weather && !forecast && defaultCities.length > 0 && (
        <>
          <h2>Popular Cities</h2>
          <CityPanel cities={defaultCities} />
        </>
      )}
    </div>
  )
}

