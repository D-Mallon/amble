import React, { useRef, useEffect, useState } from 'react';
import Map from "./components/Map";
import "./App.css";

mapboxgl.accessToken = 'pk.eyJ1IjoiZmluYmFyYWxsYW4iLCJhIjoiY2xqY3NtYWN6MjV0ODNqcXhhaTY4aGQxdSJ9.VeVQzxCCtpyP_MeT1CkjOg';

import { createTheme } from '@mui/material/styles';
import start_place from "./components/start_place";
import start_time from './components/start_time';
import preference from './components/preference';
import distance from './components/walk_distance';


function App() {

  const [inputValues, setInputValues] = useState([40.73581157695216,
    -73.9904522895813,
    40.74218481889335,
    -73.98786664009094]);
  console.log('App inputValues:', inputValues);

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
            <StartPlace inputValues={inputValues} setInputValues={setInputValues}/>
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
          <Map inputValues={inputValues}/>
        </div>
      </div>
    </div>
  );
}

export default App;


