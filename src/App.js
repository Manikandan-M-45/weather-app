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
  return (
    <div className='not-found container text-center py-5'>
      <div className='card not-found-card'>
        {!cityNotFound && <div className='not-found-message'>City not found</div>}
        {loading && (
          <div className='loading-spinner'>
            <div className='spinner-border text-primary' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          </div>
        )}
        {error && <div className='error-message alert alert-danger'>{error}</div>}
      </div>
    </div>
  );
};

const Weather = ({ city, icon, temp, humidity, windSpeed, country, weatherInfo }) => {
  // Get current date and time
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className='weather-container'>
      <div className='weather-card card'>
        <div className='card-body'>
          {/* Location and Date Section */}
          <div className='location-section mb-4'>
            <h2 className='city-name'>{city}</h2>
            <div className='country-date'>
              <span className='country-badge badge bg-primary'>{country}</span>
              <span className='date-time'>{formattedDate} • {formattedTime}</span>
            </div>
          </div>
          
          {/* Main Weather Info */}
          <div className='weather-main row align-items-center'>
            <div className='col-md-6 temperature-section'>
              <div className='temp-display'>
                <span className='temperature'>{temp}</span>
                <span className='temp-unit'>°C</span>
              </div>
              <h3 className='weather-description'>{weatherInfo}</h3>
            </div>
            <div className='col-md-6 text-center'>
              <img src={icon} alt="Weather Icon" className='weather-icon' />
            </div>
          </div>
          
          {/* Additional Weather Details */}
          <div className='weather-details row mt-4'>
            <div className='col-6 detail-item'>
              <div className='detail-icon humidity-icon'></div>
              <div className='detail-text'>
                <span className='detail-label'>Humidity</span>
                <span className='detail-value'>{humidity}%</span>
              </div>
            </div>
            <div className='col-6 detail-item'>
              <div className='detail-icon wind-icon'></div>
              <div className='detail-text'>
                <span className='detail-label'>Wind Speed</span>
                <span className='detail-value'>{windSpeed} km/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const key = process.env.REACT_APP_API_KEY;
  
  const [text, setText] = useState("Madurai");
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
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

  const search = async () => {
    setLoading(true);
    setError(null);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${key}&units=metric`;

    try {
      let response = await fetch(url);
      let data = await response.json();

      if (data.cod === "404") {
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
      setError("Error occurred while fetching weather data");
      console.error("Error: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
      search();
    }
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div className="app-container">
      <div className='container'>
        <h1 className='app-title text-center mb-4'>Weather Forecast</h1>
        
        <div className='search-container'>
          <div className='input-group mb-4'>
            <input
              type="text"
              className='form-control search-input'
              placeholder='Enter city name...'
              onChange={handleChange}
              value={text}
              onKeyDown={handleKeyDown}
            />
            <button
              className='btn btn-primary search-button'
              onClick={search}
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        <div className='weather-display'>
          {loading || cityNotFound || error ? 
            <NotFound error={error} loading={loading} cityNotFound={cityNotFound} /> : 
            <Weather 
              icon={icon} 
              city={city} 
              temp={temp} 
              humidity={humidity} 
              windSpeed={windSpeed} 
              country={country} 
              weatherInfo={weatherInfo} 
            />
          }
        </div>
      </div>
    </div>
  );
}

export default App;