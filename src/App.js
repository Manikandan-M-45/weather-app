import React, { useEffect, useState } from 'react';
import './weather.css';
import clearSkyIcon from '../src/images/sun.png';
import fewCloudsIcon from '../src/images/few_clouds.png';
import scatteredCloudsIcon from '../src/images/scattered_clouds.png';
import brokenCloudsIcon from '../src/images/broken_clouds.png';
import showerRainIcon from '../src/images/shower_rain.png';
import thunderstormIcon from '../src/images/thunderstorm.png';
import snowIcon from '../src/images/winter.png';
import rainyIcon from '../src/images/rain.png';
import mistIcon from '../src/images/mist.png';

const NotFound = ({ error, loading, cityNotFound }) => {
  return(
    <div className='not_found container'>
      {/* <h2>{!cityNotFound && "city not found"} </h2>
      <h2>{loading} </h2>
      <h2>{error} </h2> */}
      {!cityNotFound && <div>city not found</div>}
      {loading && <div>Loading....</div>}
      {error && <div>{error}</div>}
    </div>
  )
}
const Weather = ({city, icon, temp, humidity, windSpeed, country,weatherInfo, text, error, loading, cityNotFound}) => {
  

  return (
    
    <div className='contact-main text-center'>
      
      <div className='container-contact'>
        
        <form className='p-2'>
          <div className="row align-items-center mx-auto">
            <div className="col-6">
              <label>City</label>
              <h2   >{city}</h2>
              <h4>{country}</h4>
            </div>
            <div className="col-6">
              <h3>{temp}&#176;c</h3>
            </div>
          </div>
          
          <div className='row mt-2'>
            <div className='col-6'>
              <label><b>Humidity</b></label>
              <h5>{humidity}%</h5>
            </div>
            <div className='col-6'>
              <label><b>Wind speed</b></label>
              <h5>{windSpeed} Km/hr</h5>
            </div>
          </div>
          <div>
            <div className='text-center'>
              <img src={icon} alt="Weather Icon" width='100px' height='100px' className='img-weather'/>
            </div>
            <h3 className='text-center'>{weatherInfo}</h3>
          </div>
         
        </form>
        
      </div>
      
    </div>
  );
};

function App() {
  const key = process.env.REACT_APP_API_KEY;
  
  const [text, setText] = useState("Madurai");
  const [temp, setTemp] = useState(0);
  const [City, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [humidity, setHumidity] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const [icon, setIcon] = useState(clearSkyIcon);
  const [weatherInfo, setWeatherInfo] = useState("");

  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const weatherIconMap = {
    "01d": clearSkyIcon,
    "01n": clearSkyIcon,
    "02d": fewCloudsIcon,
    "02n": fewCloudsIcon,
    "03d": scatteredCloudsIcon,
    "03n": scatteredCloudsIcon,
    "04d": brokenCloudsIcon,
    "04n": brokenCloudsIcon,
    "09d": showerRainIcon,
    "09n": showerRainIcon,
    "10d": rainyIcon,
    "10n": rainyIcon,
    "11d": thunderstormIcon,
    "11n": thunderstormIcon,
    "13d": snowIcon,
    "13n": snowIcon,
    "50d": mistIcon,
    "50n": mistIcon,
  };
  console.log('rendered')

  // Search function
  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${key}&units=metric`;

    try {
      let response = await fetch(url);
      let data = await response.json();

      if (data.cod === "404") {
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false); 
        return;
      }

      setHumidity(data.main.humidity);
      setWindSpeed(data.wind.speed);
      setCountry(data.sys.country);
      setCity(data.name);
      setWeatherInfo(data.weather[0].main);
      setTemp(Math.floor(data.main.temp));
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearSkyIcon);
      setCityNotFound(false);
    } catch (error) {
      console.error("Error: ", error.message);
      setError("Error occured while fetching");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
      search();
    }
    // console.error("Error: ", error);
  };

  useEffect(() => {
  console.log('effect rendered')

    search();
  }, [])
  return (
    <div className="container mt-5">
      <div className='container'>
            
          <div className='row '>
            <div className='col-5 d-flex mx-auto'>
              <input
                type="text"
                className='form-control'
                onChange={handleChange}
                value={text}
                onKeyDown={handleKeyDown}
              />

              <input
                type="button"
                value="Search"
                className='btn btn-danger'
            onClick={search}
          />
          </div>

          </div>
      </div>
      <div className='mx-auto'>
        {!loading && !cityNotFound ? <Weather icon={icon} city={City} temp={temp} humidity={humidity} windSpeed={windSpeed} country={country} weatherInfo={weatherInfo} text={text} loading={loading} error={error} cityNotFound={cityNotFound}/> : <NotFound/>}
  

      </div>


    </div>
  );
}

export default App;

    