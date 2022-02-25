import React, { Component, useState, useEffect } from 'react'
import axios from 'axios'
const Showcountry = (props) => {
    const{countries, handleclick, api_key} = props

    const Weather=(props)=>{
        const{capital, api_key} = props
        const [weather, setWeather] = useState('')
        useEffect(() => {
            axios
            .get(`http://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`)
            .then(response => {
                setWeather(response.data)
            })
        }, [])
        
        const value = weather.weather
        return(
            <div>
                <div> temperature {weather?.main?.temp} Celcius</div>
                <div>
                <img src={`http://openweathermap.org/img/wn/${value?.[0].icon}@2x.png`} alt="icon" width="120" height="100"/>
                </div>
                <p>wind {weather?.wind?.speed} m/s</p>
            </div>
            
        )
    }
   
    if (countries.length > 10){
        return (
            <div>Too many matches, specify another filter</div>
        )
    }
    else if (countries.length === 1) {
        
    
        return (
            <div>
                <h2>{countries[0].name.common}</h2>
                <p>capital {countries[0].capital[0]}<br/>area {countries[0].area}</p>
                <h3>languages</h3>
                <ul>
                    {
                    Object.keys(countries[0].languages).map((key, index)=><li key={index}>{countries[0].languages[key]}</li>)
                    }
                </ul>
                <img src={countries[0].flags.png} alt="flag" width="120" height="100"></img>
                <h2>Weather in {countries[0].capital[0]}</h2>
                <Weather capital={countries[0].capital[0]} api_key={api_key}/>
            </div>
        )
    }
    return (
        <div>
            {
                countries.map((country)=>
                <div key={country.ccn3}>
                    {country.name.common}<button key={country.ccn3} data-value={[country]} onClick={()=>handleclick([country])}>show</button>
                    
                </div>
                )
            }
            
        </div>
    );
}

export default Showcountry;