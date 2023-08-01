import React, { useState, useEffect, useContext } from 'react';
import { ArrayContext, useWaypointsArray } from "../context/ArrayContext";
import Slider from "@mui/material/Slider";

import communityIcon from '/static/images/community_icon.png';
import museumArtIcon from '../../static/images/museum_art_icon.png';
import worshipIcon from '../../static/images/worship_icon.png';
import libraryIcon from '../../static/images/library_icon.png';
import parkIcon from '/static/images/park_icon.png';
import cafeIcon from '../../static/images/cafe_icon.png';
import restaurantIcon from '../../static/images/restaurant_icon.png';

function Ratings() {
  const { globalArray, setGlobalArrayValue, getGlobalArrayItem, addToGlobalArray } = useContext(ArrayContext);
  const [ratings, setRatings] = useState({});
  
  // Ratings Function
  const getIconByType = (type) => {
    switch (type) {
      case 'community':
        return communityIcon;
      case 'museum_art':
        return museumArtIcon;
      case 'worship':
        return worshipIcon;
      case 'library':
        return libraryIcon;
      case 'cafe':
        return cafeIcon;
      case 'restaurant':
        return restaurantIcon;

      default:
        return parkIcon;
    }
  };

  // Step 2: Initialize the ratings
  useEffect(() => {
    const initialRatings = {};
    globalArray
      .filter(item => item.type !== "walking_node" && item.type !== "park_node")
      .forEach(stop => {
        initialRatings[stop.id] = { name: stop.name, rating: stop.rating }; // Default rating
      });
    setRatings(initialRatings);
  }, [globalArray]);

  // Step 3: Update the ratings
  const handleRatingChange = (stopId, value) => {
    setRatings(prevRatings => ({
      ...prevRatings,
      [stopId]: { ...prevRatings[stopId], rating: value }
    }));
  };

  // Step 4: Submit the ratings
  const handleButtonClick_close = () => {
    // Process the ratings as needed, e.g., save to an array
    const ratingsArray = Object.values(ratings);
    console.log('Submitted Ratings:', ratingsArray);
    // You can further process the ratingsArray as needed
  };

  return (
    <div className="each-stop-inform">
      {globalArray
        .filter((item) => item.type !== "walking_node" && item.type !== "park_node")
        .map((stop, index) => (
          <div className="stop-info" key={stop.id}>
            <div className="stand-icon">
              <img src={getIconByType(stop.type)} alt={`${stop.type} icon`}/>
            </div>
            <span>{`PLACE ${index + 1}`}</span><br/>
            <span className="park-name">{stop.name}</span>
            <Slider
              aria-label="love-degree"
              defaultValue={ratings[stop.id]?.rating || 50}
              valueLabelDisplay="auto"
              step={10}
              marks
              min={0}
              max={100}
              onChange={(e, value) => handleRatingChange(stop.id, value)}
            />
          </div>
        ))
      }
    </div>
  );
}

export default Ratings;