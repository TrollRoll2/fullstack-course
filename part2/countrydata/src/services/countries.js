import axios from 'axios'

const countries = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const country = 'https://studies.cs.helsinki.fi/restcountries/api/name'
const countrydata = `https://api.openweathermap.org/data/2.5/weather?`
const api_key = import.meta.env.VITE_API_KEY

const getCountries = () => {
    const request = axios.get(countries)
    return request.then(response => response.data)
}

const getCountry = (c) => {
    const request = axios.get(`${country}/${c}`)
    return request.then(response => response.data)
}

const getWeather = (c) => {
    const request = axios.get(`${countrydata}q=${c.capital}&units=metric&appid=${api_key}`)
    return request.then(response => response.data)
}

export default {getCountries, getCountry, getWeather}