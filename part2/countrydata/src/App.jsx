import { useState, useEffect } from 'react'
import countrysearch from './services/countries'

const Searchbar = ({newFilter, handleInputFilter}) => (
  <div>
    Find countries <input
    value={newFilter}
    onChange={handleInputFilter} />
  </div>
)

const Countrylist = ({filteredCountries}) => {
  if (filteredCountries) {
    return (filteredCountries.length > 10
      ? <div>Too many matches, please specify</div>
      : filteredCountries.length == 1
        ? CountryView(filteredCountries[0])
        : filteredCountries.map(country => <li key={country.name.common}>{country.name.common}</li>)
    )
  }
}

const CountryView = (c) => {
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
    </div>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    countrysearch
      .getCountries()
      .then(response => {
        setCountries(response)
      })
  }, [])

  const handleInputFilter = (event) => {
    setNewFilter(event.target.value)
  }

  const filteredCountries = countries.filter(c => c.name.common.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <Searchbar newFilter={newFilter} handleInputFilter={handleInputFilter} />
      <Countrylist filteredCountries={filteredCountries} />
    </div>
  )
}

export default App
