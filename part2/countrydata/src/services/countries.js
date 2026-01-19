import axios from 'axios'

const countries = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const country = 'https://studies.cs.helsinki.fi/restcountries/api/name'

const getCountries = () => {
    const request = axios.get(countries)
    return request.then(response => response.data)
}

const getCountry = (c) => {
    const request = axios.get(`${country}/${c}`)
    return request.then(response => response.data)
}

export default {getCountries, getCountry}