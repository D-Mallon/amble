import React, { useRef, useEffect, useState } from 'react';
import Map from "./components/Map";
import "./App.css";


const reactLogo = "react.svg";
const viteLogo = "vite.svg";
const reactLogoPath = `/static/${reactLogo}`;
const viteLogoPath = `/static/${viteLogo}`;
import { createTheme } from '@mui/material/styles';
// import StartPlace from "./components/start_place";
import StartTime from './components/start_time';
import Preference from './components/preference';
import Distance from './components/walk_distance';


function App() {
  return (
    <div>
      <img
        src="/static/images/menu.png"
        className="menu-button"
        alt="Menu button"
      />

      <div className="PlanWin">
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
            <StartTime /> 
          </div>

          <div className="walk-duration">
            <span className="text_bar_3">Distance:</span>
            <span className="spacer1">&nbsp;</span>
            <Distance /> 
          </div>


          <div className="preference">
            <span className="text_bar_3">Preference:</span>
            < Preference /> 
          </div>

  <div className="gain-route">
    <button className="gainroute-button">Gain a Route</button>
  </div>
        </div>

        <div className="PlanMap">
          <div className="additional-blocks">
            <div className="additional-block-text">
              <span className="text_bar_2">Choose Position</span>
            </div>
            <div className="additional-block-close">
              <img
                src="/static/images/close.png"
                className="close-button"
                alt="Mclose button"
              />
            </div>
          </div>
          <Map />
        </div>
      </div>
    </div>
  );
}

export default App;


