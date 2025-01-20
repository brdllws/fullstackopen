import { useState, useEffect } from 'react'
import countryService from './services/countries'


const CountryItem = ({ country }) => {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <>    
      <p>{country} <button onClick={() => setShowInfo(!showInfo)}>show</button></p>
      {showInfo ? <InfoCard country={country} /> : null}
    </>
  )
}

const InfoCard = ({ country }) => {
  const [currCountry, setCurrCountry] = useState('')
  const [weatherInfo, setWeatherInfo] = useState(null)

  useEffect(() => {
    countryService
      .getCountry(country)
      .then(response => { 
        setCurrCountry(response)
      })      
  }, [])

  if (currCountry) {
    countryService
      .getWeather(currCountry.capitalInfo.latlng[0], currCountry.capitalInfo.latlng[1])
      .then(response => setWeatherInfo(response))
    return (
    <>
      <h2>{currCountry.name.common}</h2>
      <p>capital: {currCountry.capital}</p>
      <p>area: {currCountry.area}</p>
      <p><b>languages:</b></p>
      <ul>
        { Object.values(currCountry.languages).map(language => <li key={language}>{language}</li>) }
      </ul>
      <h2>Weather in {currCountry.capital}</h2>
      {weatherInfo ? <p>Temperature: {weatherInfo.current_weather.temperature} celsius</p> : null}
      {weatherInfo ? <p>Wind: {weatherInfo.current_weather.windspeed} km/h</p> : null}
    </>
    )
  }
}

const CountryInfo = ({ name }) => {  
  const [allCountries, setAllCountries] = useState([])  

  useEffect(() => {
    countryService
      .getAll()
      .then(countries => {
        setAllCountries(countries.map(country => country.name.common))
      })
  }, [])
  const matches = allCountries.filter(country => 
    country.toLowerCase().includes(name.toLowerCase())
  );  
  if (matches.length > 1 && name != '') {
    return (
      <> 
        { matches.length > 10 ? <p>Too many matches</p> : matches.map(country => {
          const showInfo = false          
          let countryInfo
          countryService
            .getCountry(country)
            .then(response => countryInfo = response)
          return (
            <CountryItem key={country} country={country} />            
        )})}      
      </>
    )
  }
  else if (name != '') {
    return (
      <InfoCard country={matches[0]} />
    )    
  }
  return null
}

const App = () => {
  const [countryInput, setCountry] = useState('')
  const handleCountry = (event) => {
    setCountry(event.target.value)
  }
  return (
    <div>
      find countries: <input value={countryInput} onChange={handleCountry} />
      <CountryInfo name={countryInput} />
    </div>

  )
}

export default App
