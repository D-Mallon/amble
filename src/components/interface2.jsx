import React, { useRef, useEffect, useState,useContext } from 'react';
import Map from "./Map_original";
import "./interface2.css";
// import StartPlace from "./components/start_place";
import StartTime from './start_time';
import Preference from './preference';
import Distance from './walk_distance';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme,ThemeProvider  } from '@mui/material/styles';
import { WEATHER_API_KEY,WEATHER_API_URL } from './api';
// import { TimeSearchContext } from './start_time';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import CloudIcon from '@mui/icons-material/Cloud';
import Forecast from './forecastweather-preplan';
import Current_w from './currentweather-preplan';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded';
import WidgetsIcon from '@mui/icons-material/Widgets';
import FaceIcon from '@mui/icons-material/Face';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuBar from './MenuBar';
import MapBackground from './mapbackground';
const theme = createTheme({
  palette: {
    primary: {
      main: '#004d40',
    },
    secondary: {
      main: '#004d40',
    },
  },
});

function Interface2() {
//   const timeData=useContext(TimeSearchContext); 
//   console.log(timeData.search);


  const handleOnSearchChange=(searchData)=>{
    console.log(searchData);
    // console.log(timeData.search);
  }


  const [isWeatherVisible, setIsWeatherVisible] = useState(false);


  const [currentWeather,setCurrentWeather]=useState(null);
  const [forecast,setForecast]=useState(null);

  const weatherdata=()=>{
    const currentWeatherFetch=fetch(`https://${WEATHER_API_URL}/weather?lat=40.776676&lon=-73.971321&appid=${WEATHER_API_KEY}&units=metric`);//write full url
    const forecastFetch=fetch(`https://${WEATHER_API_URL}/forecast?lat=40.776676&lon=-73.971321&appid=${WEATHER_API_KEY}&units=metric`);
    Promise.all([currentWeatherFetch,forecastFetch])
    .then(async(response)=>{
      const weatherResponse=await response[0].json();
      const forecastResponse=await response[1].json();

      setCurrentWeather(weatherResponse);
      setForecast(forecastResponse);
    })
    .catch((error)=>console.log(error));
  }

  useEffect(() => {
    weatherdata(); 
  }, []); 

  console.log(currentWeather);
  console.log(forecast);


  return (
    <ThemeProvider theme={theme}>
      <div>
        {/* <img
          src="/static/images/menu.png"
          className="menu-button"
          alt="Menu button"
        /> */}
         <MenuBar/>
         <div className='mapwrapper'>
        <MapBackground zoom={14.4}/>
        </div>
        <div className="PlanWin">
        
          {isWeatherVisible && (
            <div className="popup-overlay">
              <div className="additional-blocks">
              <div className="additional-block-text-preplan-weatherwin">
                <span className="text_bar_2-preplan-weatherwin">Weather Information</span>
              </div>
              <div className="additional-block-close" onClick={() => setIsWeatherVisible(!isWeatherVisible)}>
                <CloseIcon sx={{ fontSize: 27 , color: 'white' }} />
              </div>
              
            </div>
            <div className="w_current">
            {currentWeather && <Current_w data={currentWeather}/>}
            </div>
            <div className="w_forecast">
           {forecast && <Forecast data={forecast}/>}
           </div>
            </div>
          )}

          <div className="PlanSet">
            <div className="green-bar">
              <span className="text_bar">Walking Setting</span>
            </div>

            <div className="start-place">
              <span className="text_bar_3">Start Place:</span>
              {/* <StartPlace />  */}
            </div>

            <div className="start-time">
              <span className="text_bar_3">Start Time:</span>
              {/* <StartTime onSearchTimeChange={handleOnSearchChange} /> */}
              <StartTime />
              {/* 有一个叫 onSearchTimeChange 的属性，属性中有一个叫handleOnSearchChange的方程*/}
            </div>

            <div className="walk-duration">
              <span className="text_bar_3">Distance:</span>
              <span className="spacer1">&nbsp;</span>
              <Distance />
            </div>

            <div className="preference">
              <span className="text_bar_3">Preference:</span>
              <Preference />
            </div>

            <div className="gain-route">
              <button className="gainroute-button">Gain a Route</button>
            </div>
          </div>

          <div className="PlanMap">
            <div className="additional-blocks">
              <div className="additional-block-text-preplan">
                <span className="text_bar_2-preplan">Choose Position</span>
              </div>
              <div
                className="additional-block-weather"
                onClick={() => setIsWeatherVisible(!isWeatherVisible)}
              >
                <CloudIcon sx={{ fontSize: 24 , color: 'white'}} />
              </div>
              <div className="additional-block-close">
                <CloseIcon sx={{ fontSize: 27 , color: 'white'}} />
              </div>
            </div>
            <Map />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Interface2;


