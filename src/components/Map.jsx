import React, { useRef, useEffect, useState, useContext } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import "mapbox-gl/dist/mapbox-gl.css";
import DateTimePicker from "react-datetime-picker";
import axios from "axios";
import { useMapInput } from "../context/MapInputContext";
import routedirection from "./routedirection";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import SearchIcon from "@mui/icons-material/Search";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import { Link, useNavigate } from "react-router-dom";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

import useRouteDisplay from "./useRouteDisplay";
import useGeocoding from "./useGeocoding";
import useMapInit from "./useMapInit";
import usePlaceNameChange from "./usePlaceNameChange";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";

import { ArrayContext, useWaypointsArray } from "../context/ArrayContext";
import ChatBox from './ChatBox';
import Ratings from './Ratings';

import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { StandaloneSearchBox } from "@react-google-maps/api";

const apiKey = import.meta.env.VITE_MAPBOX_API_KEY;
mapboxgl.accessToken = apiKey;

const Map = () => {
  const StyledRating = styled(Rating)({
    "& .MuiRating-iconFilled": {
      color: "#ff6d75",
    },
    "& .MuiRating-iconHover": {
      color: "#ff3d47",
    },
  });

  const navigate = useNavigate();
  const normalImagePath = "/static/images/chatamble3.png";
  const hoverImagePath = "/static/images/chatamble2.png";

  const { inputValues, setInputValues } = useMapInput();
  const { globalArray, setGlobalArrayValue } = useWaypointsArray();
  const [ walkRating, setWalkRating] = useState(2); 
  const [ waypointRatings, setWaypointRatings] = useState({}); 
  console.log(globalArray)
  
  const mapContainer = useRef(null);
  const [lat, setLat] = useState(40.73);
  const [lng, setLng] = useState(-73.445);
  const [zoom, setZoom] = useState(12.4);
  const [beginLocationPressed, setBeginLocationPressed] = useState(false);
  const [endLocationPressed, setEndLocationPressed] = useState(false);
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [sliderValue, setSliderValue] = useState(1);
  const [sliderUnit, setSliderUnit] = useState("km");
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
  const { route, displayRoute, directiondata } = useRouteDisplay(map.current, inputValues, setInputValues, setGlobalArrayValue);
  const { location, setLocation } = useGeocoding(map.current, beginLocationPressed, setBeginLocationPressed, endLocationPressed, setEndLocationPressed,
    inputValues, setInputValues, showEndLocationInput, setShowEndLocationInput, setShowGoButton);
  const { placeName, suggestions, handlePlaceNameChange, handlePlaceSelect } = usePlaceNameChange("", setInputValues);

  const handleNowButtonClick = () => {
    setNowSelected(true);
    setLaterSelected(false);
    const now = new Date();
    const currentHour = now.getHours();
    setInputValues((prevValues) => ({ ...prevValues, hour: currentHour }));

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

    setInputValues((prevValues) => ({ ...prevValues, hour: currentHour }));

    // Set the time state to the rounded time
    setTime(now);

    // Show the date-time picker
    setShowTimeInput(true);

    setShowDistanceInput(true);
  };

  const handleTimeChange = (value) => {
    const [hours, minutes] = value.split(":");
    const time = new Date(inputValues.time);
    time.setHours(hours, minutes);
    setInputValues((prevValues) => ({ ...prevValues, time }));
  };

  const handleSliderChange = (event) => {
    const newDistance = event.target.value;
    setInputValues((prevValues) => ({ ...prevValues, distance: newDistance }));
    console.log("handleSliderChange", inputValues);
  };

  const handleInputSubmit = async (e) => {
    e.preventDefault();

    console.log("handleInputSubmit", inputValues);

    try {
      const response = await axios.post(
        "/users/handle_routeinpput_data",
        inputValues,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("errorless:", response.data);
      const waypoints = response.data["waypoints"];
      console.log("waypoints:", waypoints);
      setInputValues({ ...inputValues, ["waypoints"]: waypoints });
      console.log("handleInputSubmit", inputValues);

      //changewindow
      setplansetwin(false);
      setchatalien(true);
      setroutedetail(true);
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

  //Below is route presentation part!!
  const [plansetwin, setplansetwin] = useState(true);
  const [chatalien, setchatalien] = useState(false);
  const [chatbox, setchatbox] = useState(false);
  const [routedetail, setroutedetail] = useState(false);
  const [ratingwin, setratingwin] = useState(false);
  const [cathover, setcatHover] = useState(false);

  const backtodetailwin = () => {
    setratingwin(false);
  };

  const togglechatbox = () => {
    setchatbox(true);
    setchatalien(false);
  };

  const closechatbox = () => {
    setchatbox(false);
    setchatalien(true);
  };

  const catcloseHover = () => {
    setcatHover(true);
  };

  const catcloseMouseLeave = () => {
    setcatHover(false);
  };

  const backtoplanwin = () => {
    setplansetwin(true);
    setchatalien(false);
    setroutedetail(false);
    setchatbox(false);
  };

  const toggleratewin = () => {
    setratingwin(true);
  };

  const handleButtonClick_close = () => {
    navigate("/");
  };

  const handleRatingsCalc = () => {
    console.log('Submitted General Walk Rating:', walkRating);
    console.log('Submitted Waypoint Ratings:', waypointRatings);

    // score mapping - edge scores have negative and positive bonuses
    // Define mappings using arrays of tuples and convert them to objects
    const walkRatingModifiers = Object.fromEntries([[1, -0.15], [2, -0.1], [3, -0.05], [4, 0.0], [5, 0.05], [6, 0.1], [7, 0.15], [8, 0.2], [9, 0.25], [10, 0.4]]);
    const ratingModifierMapping = Object.fromEntries([[-5, -0.6], [-4, -0.4], [-3, -0.3], [-2, -0.2], [-1, -0.1], [0, 0], [1, 0.1], [2, 0.2], [3, 0.3], [4, 0.4], [5, 0.6]]);

    const updatedGlobalArray = globalArray.map((node) => {
      // Apply the walkRating modifier to all nodes
      let rating = node.rating + walkRatingModifiers[walkRating];
      // Find the corresponding waypoint in waypointRatings and apply the rating_modifier if exists
      const waypoint = waypointRatings.find((w) => w.id === node.id);
        if (waypoint) {
          rating += ratingModifierMapping[waypoint.rating_modifier];
        }
      // Clamp the rating between 0 and 5
      rating = Math.max(0, Math.min(5, rating));
      return { ...node, rating }; // Update the node with the new rating
    });

    // Update globalArray
    setGlobalArrayValue(updatedGlobalArray);
    console.log("new globalArray state:", globalArray);
    // Update main JSON file 
  
  };
    
  const handleSubmit = () => {
    handleButtonClick_close(); // Function to close the popup
    handleRatingsCalc(); // Function to process ratings
  };

  return (
    <div>
      {plansetwin && (
        <>
          <div className="user-input">
            <div className="titlebox">
              <span className="text_bar-mapfunction">My Journey Planner</span>
            </div>
            <div className="when-input">
              <p>When?</p>
              <Stack
                spacing={2}
                direction="row"
                justifyContent="center"
                paddingBottom="15px"
              >
                <Button
                  className="now-button"
                  sx={{ width: "100px", height: "2.5rem" }}
                  variant={nowSelected ? "contained" : "outlined"}
                  style={
                    nowSelected
                      ? { borderRadius: 0 }
                      : {
                        backgroundColor: "transparent",
                        borderColor: "black",
                        color: "black",
                        boxShadow: "none",
                        borderRadius: 0,
                      }
                  }
                  onClick={handleNowButtonClick}
                >
                  Now
                </Button>
                <Button
                  variant={laterSelected ? "contained" : "outlined"}
                  sx={{ width: "100px", height: "2.5rem" }}
                  style={
                    laterSelected
                      ? { borderRadius: 0 }
                      : {
                        borderRadius: 0,
                        backgroundColor: "transparent",
                        borderColor: "black",
                        color: "black",
                        boxShadow: "none",
                      }
                  }
                  onClick={handleLaterButtonClick}
                >
                  Later
                </Button>
              </Stack>
              {showTimeInput && (
                <DateTimePicker
                  // sx={{ width: "100px", height: "2.5rem" }}
                  value={time}
                  onChange={(value) => {
                    if (value) {
                      setTime(value);
                      setInputValues((prevValues) => ({
                        ...prevValues,
                        hour: value.getHours(),
                      }));
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
                <div
                  style={{ display: "flex", alignItems: "center", gap: "20px" }}
                >
                  <Slider
                    style={{ width: "150px" }}
                    value={sliderValue}
                    min={sliderUnit === "km" ? 1 : 10}
                    max={sliderUnit === "km" ? 10 : 100}
                    step={sliderUnit === "km" ? 0.5 : 5}
                    valueLabelDisplay="auto"
                    onChange={(event, newValue) => {
                      setSliderValue(newValue), handleSliderChange(event);
                    }}
                    onChangeCommitted={() => {
                      setShowBeginLocationInput(true);
                    }}
                  />
                  <Button
                    sx={{ width: "100px", height: "2.5rem" }}
                    variant="outlined"
                    style={
                      nowSelected
                        ? {
                          borderColor: "black",
                          color: "black",
                          borderRadius: 0,
                        }
                        : {
                          borderColor: "black",
                          color: "black",
                          borderRadius: 0,
                        }
                    }
                    onClick={() => {
                      if (sliderUnit === "km") {
                        // Scale the slider value from the km range to the min range
                        const position = (sliderValue - 1) / (10 - 1);
                        const newValue = position * (100 - 10) + 10;
                        setSliderValue(newValue);
                        setSliderUnit("min");
                      } else {
                        // Scale the slider value from the min range to the km range
                        const position = (sliderValue - 10) / (100 - 10);
                        const newValue = position * (10 - 1) + 1;
                        setSliderValue(newValue);
                        setSliderUnit("km");
                      }
                      handleSliderChange({ target: { value: sliderValue } });
                    }}
                  >
                    {sliderUnit === "km"
                      ? `${sliderValue} km`
                      : `${sliderValue} mins`}
                  </Button>
                </div>
              </div>
            )}

            {showBeginLocationInput && (
              <div>
                <p>Where would you like to begin?</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Stack
                    spacing={1}
                    direction="row"
                    justifyContent="center"
                    paddingBottom="15px"
                  >
                    <Button
                      onClick={() => {
                        setInputValues((prevValues) => ({
                          ...prevValues,
                          latitude: 40.7505,
                          longitude: -73.9934,
                        }));
                        setShowBeginField(false);
                        setHomeSelected(true);
                        setSearchSelected(false);
                        setAddressSelected(false);
                        setShowEndLocationInput(true);
                      }}
                      sx={{ width: "110px", height: "2.5rem" }}
                      startIcon={<HomeIcon />}
                      variant={homeSelected ? "contained" : "outlined"}
                      style={
                        homeSelected
                          ? { borderRadius: 0 }
                          : {
                            borderRadius: 0,
                            backgroundColor: "transparent",
                            borderColor: "black",
                            color: "black",
                            boxShadow: "none",
                          }
                      }
                    >
                      Home
                    </Button>

                    <Button
                      onClick={() => {
                        setBeginLocationPressed(!beginLocationPressed);
                        setShowBeginField(false);
                        setHomeSelected(false);
                        setSearchSelected(true);
                        setAddressSelected(false);
                      }}
                      sx={{ width: "110px", height: "2.5rem" }}
                      startIcon={
                        beginLocationPressed ? (
                          <LocationSearchingIcon />
                        ) : (
                          <MapIcon />
                        )
                      }
                      variant={searchSelected ? "contained" : "outlined"}
                      style={
                        searchSelected
                          ? { borderRadius: 0 }
                          : {
                            borderRadius: 0,
                            backgroundColor: "transparent",
                            borderColor: "black",
                            color: "black",
                            boxShadow: "none",
                          }
                      }
                    >
                      {beginLocationPressed ? "Click" : "Map"}
                    </Button>

                    <Button
                      onClick={() => {
                        setShowBeginField(true);
                        setHomeSelected(false);
                        setSearchSelected(false);
                        setAddressSelected(true);
                      }}
                      sx={{ width: "110px", height: "2.5rem" }}
                      startIcon={<SearchIcon />}
                      variant={addressSelected ? "contained" : "outlined"}
                      style={
                        addressSelected
                          ? { borderRadius: 0 }
                          : {
                            borderRadius: 0,
                            backgroundColor: "transparent",
                            borderColor: "black",
                            color: "black",
                            boxShadow: "none",
                          }
                      }
                    >
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
                    style={{
                      width: 350,
                      paddingBottom: "15px",
                      color: "black",
                      borderRadius: 0,
                    }}
                    onInputChange={handlePlaceNameChange}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        handlePlaceSelect(newValue);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Type Address"
                        variant="outlined"
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "black",
                            },
                            "&:hover fieldset": {
                              borderColor: "black",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "black",
                            },
                          },
                          "& .MuiFormLabel-root": {
                            color: "black",
                            "&.Mui-focused": {
                              color: "black",
                            },
                          },
                          "& .MuiInputBase-root": {
                            color: "black",
                          },
                          "& .MuiAutocomplete-clearIndicator": {
                            color: "black",
                          },
                          "& .MuiAutocomplete-popupIndicator": {
                            color: "black",
                          },
                        }}
                      />
                    )}
                  />
                )}
              </div>
            )}

            {showEndLocationInput && (
              <div>
                <p>Where would you like to go?</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Stack
                    spacing={1}
                    direction="row"
                    justifyContent="center"
                    paddingBottom="15px"
                  >
                    <Button
                      onClick={() => {
                        setInputValues((prevValues) => ({
                          ...prevValues,
                          endLatitude: 40.711667,
                          endLongitude: -74.0125,
                        }));
                        setEndHomeSelected(true);
                        setEndSearchSelected(false);
                        setEndAddressSelected(false);
                        setShowGoButton(true);
                        setShowEndField(false);
                      }}
                      startIcon={<HomeIcon />}
                      sx={{ width: "110px", height: "2.5rem" }}
                      variant={endHomeSelected ? "contained" : "outlined"}
                      style={
                        endHomeSelected
                          ? { borderRadius: 0 }
                          : {
                            borderRadius: 0,
                            backgroundColor: "transparent",
                            borderColor: "black",
                            color: "black",
                            boxShadow: "none",
                          }
                      }
                    >
                      Home
                    </Button>

                    <Button
                      onClick={() => {
                        setEndLocationPressed(!endLocationPressed);
                        setEndHomeSelected(false);
                        setEndSearchSelected(true);
                        setEndAddressSelected(false);
                        setShowEndField(false);
                      }}
                      sx={{ width: "110px", height: "2.5rem" }}
                      startIcon={
                        endLocationPressed ? (
                          <LocationSearchingIcon />
                        ) : (
                          <MapIcon />
                        )
                      }
                      variant={endSearchSelected ? "contained" : "outlined"}
                      style={
                        endSearchSelected
                          ? { borderRadius: 0 }
                          : {
                            borderRadius: 0,
                            backgroundColor: "transparent",
                            borderColor: "black",
                            color: "black",
                            boxShadow: "none",
                          }
                      }
                    >
                      {endLocationPressed ? "Click" : "Map"}
                    </Button>

                    <Button
                      onClick={() => {
                        setEndHomeSelected(false);
                        setEndSearchSelected(false);
                        setEndAddressSelected(true);
                        setShowEndField(true);
                      }}
                      sx={{ width: "110px", height: "2.5rem" }}
                      startIcon={<SearchIcon />}
                      variant={endAddressSelected ? "contained" : "outlined"}
                      style={
                        endAddressSelected
                          ? { borderRadius: 0 }
                          : {
                            backgroundColor: "transparent",
                            borderColor: "black",
                            color: "black",
                            boxShadow: "none",
                            borderRadius: 0,
                          }
                      }
                    >
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
                    style={{
                      width: 350,
                      paddingBottom: "15px",
                      color: "black",
                      borderRadius: 0,
                    }}
                    onInputChange={handlePlaceNameChange}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        handlePlaceSelect(newValue);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Type Address"
                        variant="outlined"
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "black",
                            },
                            "&:hover fieldset": {
                              borderColor: "black",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "black",
                            },
                          },
                          "& .MuiFormLabel-root": {
                            color: "black",
                            "&.Mui-focused": {
                              color: "black",
                            },
                          },
                          "& .MuiInputBase-root": {
                            color: "black",
                          },
                          "& .MuiAutocomplete-clearIndicator": {
                            color: "black",
                          },
                          "& .MuiAutocomplete-popupIndicator": {
                            color: "black",
                          },
                        }}
                      />
                    )}
                  />
                )}
              </div>
            )}

            {showGoButton && (
              // <Stack spacing={1} direction="row" justifyContent="center" paddingBottom="15px">
              //   <Button   sx={{ width: "200px", height: "2.5rem" }}  variant="contained" type="submit" size="large" style={{ borderRadius: 0 }} onClick={handleInputSubmit}>GO</Button>
              // </Stack>

              <div className="plansetting">
                <a
                  className="plansetting-text"
                  type="submit"
                  onClick={handleInputSubmit}
                >
                  <span>Let's Go!</span>
                </a>
              </div>
            )}

            {/* <Button  sx={{ width: "200px", height: "2.5rem" }} style={{ borderRadius: 0 }} variant='outlined' onClick={() => console.log("These were the inputValues:", inputValues)}>Tell me baby...</Button> */}
            {!showGoButton && (
              <span className="detail-text">
                Dear user, please tell me more...
              </span>
            )}
          </div>
        </>
      )}

      {/* Routeshowing win part */}
      {routedetail && (
        <>
          <div className="additional-block-text-detailtitle">
            <span className="text_bar_2-detailtitle">
              Route Plan Presentation
            </span>
          </div>
          <div
            className="additional-block-datail-button"
            onClick={backtoplanwin}
          >
            <span className="text_bar_2-detail">Change Journey Plan</span>
          </div>

          <div className="detailbox">
            <div className="detail-titlebox">
              <span className="text_bar-mapfunction-detail">
                My Walk Details
              </span>
            </div>
            <p>Distance and Duration</p>

            <p>Preference</p>

            <p>Quietness Score</p>

            <div className="directionbox">
              <div className="directionbox-titlebox">
                <span className="text_bar-mapfunction-detail-2">
                  Direction Helper
                </span>
    
              </div>
              <div className="directiondetail">
              <ul className="directionswords">
  {directiondata.map((step, index) => (
    <span key={index}>
      <span className="bold-step">{`Step ${index + 1}: `}&nbsp;&nbsp;</span>
      {`${step.action ? step.action : 'Proceed'}${step.road ? ` on ${step.road}` : ''}${step.distance ? ` for ${step.distance.toFixed(2)} meters` : ''}${step.isKeyNode ? ' (Arrived at Key Node)' : ''}`}
      <br />
    </span>
  ))}
</ul>
</div>
            </div>

            <div className="finishdetail">
              <a
                className="finishdetail-text"
                type="submit"
                onClick={toggleratewin}
              >
                <span>Finish My Walk!</span>
              </a>
            </div>
          </div>
        </>
      )}

      {chatalien && (
        <>
          <img
            src={normalImagePath}
            alt="Normal Image"
            className="alien-robot"
            onMouseEnter={(e) =>
              e.currentTarget.setAttribute("src", hoverImagePath)
            }
            onMouseLeave={(e) =>
              e.currentTarget.setAttribute("src", normalImagePath)
            }
            onClick={togglechatbox}
          />
        </>
      )}

      {chatbox && (
        <>
          <div className="alienchatbox" id="chatbox">
            {cathover ? (
              <img
                src="/static/images/chatamble0.png"
                alt="Image"
                className="chat-robot-two"
              />
            ) : (
              <img
                src="/static/images/chatamble1.png"
                alt="Image"
                className="chat-robot-two"
              />
            )}
            <div className="chat-titlebox">
              <div
                className="additional-block-close-chatbox"
                onClick={closechatbox}
                onMouseEnter={catcloseHover}
                onMouseLeave={catcloseMouseLeave}
              >
                <CloseIcon sx={{ fontSize: 27, color: "white" }} />
              </div>
              <span className="text_bar-mapfunction-chat">Chat with Amble</span>
            </div>
            
            <ChatBox />
            
            
          </div>
        </>
      )}

      {/* Ratings Popup for Waypoints*/}
      {ratingwin && (
        <div className="ratewin">
          {/* <div className='white-board'></div> */}
          <img
            src="/static/images/MenuPic5.jpg"
            alt="pics"
            className="ratewin-background"
          ></img>
          <div className="additional-blocks-ratewin">
            {/*<div className="additional-block-text-ratewin">
              <span className="text_bar_2-ratewin">Rate Your Walk</span>
              </div>*/}

            <div
              className="additional-block-rate-button"
              onClick={backtodetailwin}
            >
              <span className="text_bar_2-detail">
                See My Walk Detail Again!
              </span>
            </div>

            <div
              className="additional-block-close-ratewin"
              onClick={handleButtonClick_close}
            >
              <CloseIcon sx={{ fontSize: 27, color: "white" }} />
            </div>
          </div>
                    <div className="General-rate-inform">
                <div className="stop-text">
                  <span>Rate Your Walk</span>
                </div>
                <Box
                  sx={{
                    "& > legend": { mt: 2 },
                  }}
                >
                  <div className="like-rate">
                    <StyledRating
                      name="customized-color"
                      defaultValue={walkRating}
                      onChange={(event, newValue) => setWalkRating(newValue)}
                      getLabelText={(value) => `${value} Heart${value !== 1 ? "s" : ""}`}
                      precision={0.5}
                      max={10}
                      icon={<FavoriteIcon fontSize="large" sx={{ fontSize: "2.2rem" }} />}
                      emptyIcon={<FavoriteBorderIcon fontSize="large" sx={{ fontSize: "2.2rem" }} />}
                    />
                  </div>
                </Box>
                <div className="stop-text">
                  <span>How much did you like your stops? </span>
                </div>
                <Ratings setWaypointRatings={setWaypointRatings} /> {/* Includes the Ratings component here */}
              </div>
              <div className="finishrate">
                <a className="finishrate-text" type="submit" onClick={handleSubmit}>
                  <span>Submit My Review</span>
                </a>
              </div>
            </div>
          )}

      <div ref={mapContainer} className="map-container" />
    </div>
  );
};

export default Map;
