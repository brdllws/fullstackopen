import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAll = () => {
  const request = axios.get(`${baseUrl}/all`)
  return request.then(response => response.data)
}

const getCountry = (name) => {
    const request = axios.get(`${baseUrl}/name/${name}`)
    return request.then(response => response.data)
}

const getWeather = (lat, long) => {
    const params = {
        "latitude": lat,
        "longitude": long,
        "current_weather": true
    }
    const request = axios.get("https://api.open-meteo.com/v1/forecast", { params })
    return request.then(response => response.data)
}

export default { getAll, getCountry, getWeather }