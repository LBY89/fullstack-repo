import { useState, useEffect } from 'react'
import axios from 'axios'

import Showcountry from './components/Showcountry'

const App = () => {


  const api_key = process.env.REACT_APP_API_KEY
  console.log('key', api_key)
  const [countries, setCountries] = useState([])
  useEffect(() => {
    
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])
  

  
  const filterCountry = (event) => {
    console.log('input', event.target.value)
    const new_countries = countries.filter(country=>country.name.official.toLowerCase().includes(event.target.value.toLowerCase()));
    
    setCountries(new_countries)
  }
  console.log('countries', countries)


  const HandleClick=(country)=>{
    setCountries(country)
  }
  
  return (
    <div>
      find countries<input  onChange={filterCountry}/>
      <Showcountry countries={countries} handleclick={HandleClick} api_key={api_key}/>
    </div>
  )
}

export default App;