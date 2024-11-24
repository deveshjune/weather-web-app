import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import WeatherNow from './WeatherNow'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <WeatherNow/>
    </>
  )
}

export default App
