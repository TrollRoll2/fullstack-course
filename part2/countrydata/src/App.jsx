import { useState, useEffect } from 'react'
import countrysearch from './services/countries'

const Searchbar = ({newFilter, handleInputFilter}) => (
  <div>
    Find countries <input
    value={newFilter}
    onChange={handleInputFilter} />
  </div>
)

const Countrylist = ({filteredCountries, showCountry}) => {
  if (filteredCountries) {
    return (filteredCountries.length > 10
      ? <div>Too many matches, please specify</div>
      : filteredCountries.length == 1
        ? <CountryView {...filteredCountries[0]}/>
        : filteredCountries.map(country => <li key={country.name.common}>{country.name.common}<button onClick={() => showCountry(country)}>show</button></li>)
    )
  }
}

const CountryView = (c) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countrysearch
      .getWeather(c)
      .then(data => {
        setWeather(data)
      })
  }, [c])

  if (!weather) return <div>Loading country...</div>
  
  return (
    <div>
      <h1>{c.name.common}</h1>
      <div>Capital: {c.capital}</div>
      <div>Area: {c.area}</div>
      <h2>Languages spoken in {c.name.common}:</h2>
      <ul>
        {Object.values(c.languages).map(l => <li key={l}>{l}</li>)}
      </ul>
      <div>Flag of {c.name.common}:</div>
      <img src={c.flags.png}/>
      <h2>Weather in {c.capital}</h2>
      <div>Temperature {weather.main.temp} Celsius</div>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/>
      <div>Wind {weather.wind.speed} m/s</div>
    </div>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [newFilter, setNewFilter] = useState('')
  const [showCountry, setShowCountry] = useState(null)

  useEffect(() => {
    countrysearch
      .getCountries()
      .then(response => {
        setCountries(response)
      })
  }, [])

  const handleInputFilter = (event) => {
    setNewFilter(event.target.value)
    setShowCountry(null)
  }

  const filteredCountries = countries.filter(c => c.name.common.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <Searchbar newFilter={newFilter} handleInputFilter={handleInputFilter} />
      {showCountry 
        ? <CountryView {...showCountry} />
        : <Countrylist filteredCountries={filteredCountries} showCountry={setShowCountry} />
      }
    </div>
  )
}

export default App
