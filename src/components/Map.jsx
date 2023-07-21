import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import DateTimePicker from 'react-datetime-picker';
import axios from 'axios';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import SearchIcon from '@mui/icons-material/Search';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';

import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

import useRouteDisplay from './useRouteDisplay';
import useGeocoding from './useGeocoding';
import useMapInit from './useMapInit';
import usePlaceNameChange from './usePlaceNameChange';


const apiKey = import.meta.env.VITE_MAPBOX_API_KEY
mapboxgl.accessToken = apiKey;

const Map = ({ inputValues, setInputValues }) => {
  const mapContainer = useRef(null);
  const [lat, setLat] = useState(40.73);
  const [lng, setLng] = useState(-73.445);
  const [zoom, setZoom] = useState(12.4);
  const [beginLocationPressed, setBeginLocationPressed] = useState(false);
  const [endLocationPressed, setEndLocationPressed] = useState(false);
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [sliderValue, setSliderValue] = useState(1);
  const [sliderUnit, setSliderUnit] = useState('km');
  const [showBeginField, setShowBeginField] = useState(false);
  const [showEndField, setShowEndField] = useState(false);
  const [initialTime, setInitialTime] = useState(() => {
    const now = new Date();
    if (now.getMinutes() !== 0) {
      now.setHours(now.getHours() + 1, 0, 0, 0);
    }
    return now;
  });
  const [time, setTime] = useState(initialTime);
  const [showDistanceInput, setShowDistanceInput] = useState(false); //change to false
  const [showBeginLocationInput, setShowBeginLocationInput] = useState(false); //change to false
  const [showEndLocationInput, setShowEndLocationInput] = useState(false); //change to false
  const [showGoButton, setShowGoButton] = useState(false);
  const [nowSelected, setNowSelected] = useState(false);
  const [laterSelected, setLaterSelected] = useState(false);
  const [homeSelected, setHomeSelected] = useState(false);
  const [searchSelected, setSearchSelected] = useState(false);
  const [addressSelected, setAddressSelected] = useState(false);
  const [endHomeSelected, setEndHomeSelected] = useState(false);
  const [endSearchSelected, setEndSearchSelected] = useState(false);
  const [endAddressSelected, setEndAddressSelected] = useState(false);


  const { map, markers } = useMapInit(mapContainer, lat, lng, zoom, inputValues);
  const { route, displayRoute } = useRouteDisplay(map.current, inputValues, setInputValues);
  const { location, setLocation } = useGeocoding(map.current, beginLocationPressed, setBeginLocationPressed, endLocationPressed, setEndLocationPressed,
    inputValues, setInputValues, showEndLocationInput, setShowEndLocationInput, setShowGoButton);
  const { placeName, suggestions, handlePlaceNameChange, handlePlaceSelect } = usePlaceNameChange('', setInputValues);

  const handleNowButtonClick = () => {
    setNowSelected(true);
    setLaterSelected(false);
    const now = new Date();
    const currentHour = now.getHours();
    setInputValues(prevValues => ({ ...prevValues, hour: currentHour }));

    // Round the current time to the nearest minute
    const roundedMinutes = Math.round(now.getMinutes());
    now.setMinutes(roundedMinutes);

    // Set the time state to the rounded time
    setTime(now);

    setShowTimeInput(false);

    setShowDistanceInput(true);
  };

  const handleLaterButtonClick = () => {
    setNowSelected(false);
    setLaterSelected(true);
    const now = new Date();
    let currentHour = now.getHours();

    // Round the current time up to the nearest hour
    if (now.getMinutes() > 0) {
      currentHour += 1;
    }
    now.setHours(currentHour, 0, 0, 0);

    setInputValues(prevValues => ({ ...prevValues, hour: currentHour }));

    // Set the time state to the rounded time
    setTime(now);

    // Show the date-time picker
    setShowTimeInput(true);

    setShowDistanceInput(true);
  };

  const handleTimeChange = (value) => {
    const [hours, minutes] = value.split(':');
    const time = new Date(inputValues.time);
    time.setHours(hours, minutes);
    setInputValues(prevValues => ({ ...prevValues, time }));
  };
  
  const handleInputSubmit = async (e) => {   
    e.preventDefault();
    
    console.log("handleInputSubmit", inputValues);
  
    try {
      const response = await axios.post('/users/handle_routeinpput_data', inputValues, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      console.log("errorless:", response.data);
      const waypoints = response.data["waypoints"];
      console.log("waypoints:", waypoints);
      setInputValues({ ...inputValues, ["waypoints"]: waypoints});
      console.log("handleInputSubmit", inputValues);

    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log("server responded with error");
      } else if (error.request) {
        console.log("network error");
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <div className="user-input">
        <h2>My Journey Planner</h2>

        <div className='when-input'>
          <p>When would you like to leave?</p>
          <Stack spacing={2} direction="row" justifyContent="center" paddingBottom="15px">
            <Button className='now-button'
              variant={nowSelected ? "contained" : "outlined"}
              style={nowSelected ?
                {} :
                { backgroundColor: 'transparent', borderColor: 'white', color: 'white', boxShadow: 'none' }
              }
              onClick={handleNowButtonClick}
            >
              Now
            </Button>
            <Button
              variant={laterSelected ? "contained" : "outlined"}
              style={laterSelected ?
                {} :
                { backgroundColor: 'transparent', borderColor: 'white', color: 'white', boxShadow: 'none' }
              }
              onClick={handleLaterButtonClick}
            >
              Later
            </Button>
          </Stack>
          {showTimeInput && (
            <DateTimePicker
              value={time}
              onChange={(value) => {
                if (value) {
                  setTime(value);
                  setInputValues(prevValues => ({ ...prevValues, hour: value.getHours() }));
                } else {
                  setTime(initialTime);
                }
              }}
            />
          )}
        </div>


        {showDistanceInput && (
          <div>
            <p>How long would like to go for?</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Slider
                style={{ width: '120px' }}
                value={sliderValue}
                min={sliderUnit === 'km' ? 1 : 10}
                max={sliderUnit === 'km' ? 10 : 100}
                step={sliderUnit === 'km' ? 0.5 : 5}
                valueLabelDisplay="auto"
                onChange={(event, newValue) => setSliderValue(newValue)}
                onChangeCommitted={() => { setShowBeginLocationInput(true) }}
              />
              <Button
                variant='outlined'
                style={nowSelected ?
                  { borderColor: 'white', color: 'white' } :
                  { borderColor: 'white', color: 'white' }
                }
                onClick={() => {
                  if (sliderUnit === 'km') {
                    // Scale the slider value from the km range to the min range
                    const position = (sliderValue - 1) / (10 - 1);
                    const newValue = position * (100 - 10) + 10;
                    setSliderValue(newValue);
                    setSliderUnit('min');
                  } else {
                    // Scale the slider value from the min range to the km range
                    const position = (sliderValue - 10) / (100 - 10);
                    const newValue = position * (10 - 1) + 1;
                    setSliderValue(newValue);
                    setSliderUnit('km');
                  }
                }}
              >
                {sliderUnit === 'km' ? `${sliderValue} km` : `${sliderValue} mins`}
              </Button>
            </div>
          </div>
        )}


        {showBeginLocationInput && (
          <div>
            <p>Where would you like to begin?</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Stack spacing={1} direction="row" justifyContent="center" paddingBottom="15px">

                <Button onClick={() => {
                  setInputValues(prevValues => ({ ...prevValues, latitude: 40.7505, longitude: -73.9934 }));
                  setShowBeginField(false);
                  setHomeSelected(true);
                  setSearchSelected(false);
                  setAddressSelected(false);
                  setShowEndLocationInput(true);
                }}
                  startIcon={<HomeIcon />}
                  variant={homeSelected ? "contained" : "outlined"}
                  style={homeSelected ?
                    {} :
                    { backgroundColor: 'transparent', borderColor: 'white', color: 'white', boxShadow: 'none' }
                  }>
                  Home
                </Button>

                <Button onClick={() => {
                  setBeginLocationPressed(!beginLocationPressed);
                  setShowBeginField(false)
                  setHomeSelected(false);
                  setSearchSelected(true);
                  setAddressSelected(false);
                }}
                  startIcon={beginLocationPressed ? <LocationSearchingIcon /> : <MapIcon />}
                  variant={searchSelected ? "contained" : "outlined"}
                  style={searchSelected ?
                    {} :
                    { backgroundColor: 'transparent', borderColor: 'white', color: 'white', boxShadow: 'none' }
                  }>
                  {beginLocationPressed ? 'Click' : 'Map'}
                </Button>

                <Button onClick={() => {
                  setShowBeginField(true)
                  setHomeSelected(false);
                  setSearchSelected(false);
                  setAddressSelected(true);
                }}
                  startIcon={<SearchIcon />}
                  variant={addressSelected ? "contained" : "outlined"}
                  style={addressSelected ?
                    {} :
                    { backgroundColor: 'transparent', borderColor: 'white', color: 'white', boxShadow: 'none' }
                  }>
                  Search
                </Button>

              </Stack>
            </div>
            {showBeginField && (
              <Autocomplete
                id="address-input"
                options={suggestions}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={() => true === true}
                style={{ width: 300, paddingBottom: "15px", color: 'white' }}
                onInputChange={handlePlaceNameChange}
                onChange={(event, newValue) => {
                  if (newValue) {
                    handlePlaceSelect(newValue);
                  }
                }}
                renderInput={(params) => <TextField {...params} label="Type Address" variant="outlined" size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiFormLabel-root': {
                      color: 'white',
                      '&.Mui-focused': {
                        color: 'white',
                      },
                    },
                    '& .MuiInputBase-root': {
                      color: 'white',
                    },
                    '& .MuiAutocomplete-clearIndicator': {
                      color: 'white',
                    },
                    '& .MuiAutocomplete-popupIndicator': {
                      color: 'white',
                    }
                  }}
                />}
              />
            )}
          </div>
        )}










        {showEndLocationInput && (
          <div>
            <p>Where would you like to go?</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Stack spacing={1} direction="row" justifyContent="center" paddingBottom="15px">

                <Button onClick={() => {
                  setInputValues(prevValues => ({ ...prevValues, endLatitude: 40.711667, endLongitude: -74.0125 }));
                  setEndHomeSelected(true);
                  setEndSearchSelected(false);
                  setEndAddressSelected(false);
                  setShowGoButton(true);
                  setShowEndField(false)
                }}
                  startIcon={<HomeIcon />}
                  variant={endHomeSelected ? "contained" : "outlined"}
                  style={endHomeSelected ?
                    {} :
                    { backgroundColor: 'transparent', borderColor: 'white', color: 'white', boxShadow: 'none' }
                  }>
                  Home
                </Button>

                <Button onClick={() => {
                  setEndLocationPressed(!endLocationPressed);
                  setEndHomeSelected(false);
                  setEndSearchSelected(true);
                  setEndAddressSelected(false);
                  setShowEndField(false)
                }}
                  startIcon={endLocationPressed ? <LocationSearchingIcon /> : <MapIcon />}
                  variant={endSearchSelected ? "contained" : "outlined"}
                  style={endSearchSelected ?
                    {} :
                    { backgroundColor: 'transparent', borderColor: 'white', color: 'white', boxShadow: 'none' }
                  }>
                  {endLocationPressed ? 'Click' : 'Map'}
                </Button>

                <Button onClick={() => {
                  setEndHomeSelected(false);
                  setEndSearchSelected(false);
                  setEndAddressSelected(true);
                  setShowEndField(true)
                }}
                  startIcon={<SearchIcon />}
                  variant={endAddressSelected ? "contained" : "outlined"}
                  style={endAddressSelected ?
                    {} :
                    { backgroundColor: 'transparent', borderColor: 'white', color: 'white', boxShadow: 'none' }
                  }>
                  Search
                </Button>

              </Stack>
            </div>
            {showEndField && (
              <Autocomplete
                id="address-input"
                options={suggestions}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={() => true === true}
                style={{ width: 300, paddingBottom: "15px", color: 'white' }}
                onInputChange={handlePlaceNameChange}
                onChange={(event, newValue) => {
                  if (newValue) {
                    handlePlaceSelect(newValue);
                  }
                }}
                renderInput={(params) => <TextField {...params} label="Type Address" variant="outlined" size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiFormLabel-root': {
                      color: 'white',
                      '&.Mui-focused': {
                        color: 'white',
                      },
                    },
                    '& .MuiInputBase-root': {
                      color: 'white',
                    },
                    '& .MuiAutocomplete-clearIndicator': {
                      color: 'white',
                    },
                    '& .MuiAutocomplete-popupIndicator': {
                      color: 'white',
                    }
                  }}
                />}
              />
            )}
          </div>
        )}

        {showGoButton && (
          <Stack spacing={1} direction="row" justifyContent="center" paddingBottom="15px">
            <Button variant="contained" type="submit" size="large" onClick={handleInputSubmit}>Go!</Button>
          </Stack>
        )}

        <Button variant='outlined' onClick={() => console.log("These were the inputValues:", inputValues)}>Tell me baby...</Button>
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};

export default Map;