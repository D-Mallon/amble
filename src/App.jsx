import React, { useRef, useEffect, useState } from 'react';
import Map from "./components/Map";
import "./App.css";
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = 'pk.eyJ1IjoiZmluYmFyYWxsYW4iLCJhIjoiY2xqY3NtYWN6MjV0ODNqcXhhaTY4aGQxdSJ9.VeVQzxCCtpyP_MeT1CkjOg';

const reactLogo = "react.svg";
const viteLogo = "vite.svg";
const reactLogoPath = `/static/${reactLogo}`;
const viteLogoPath = `/static/${viteLogo}`;

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
  </div>

  <div className="start-time">
  <span className="text_bar_3">Start Time:</span>
  </div>

  <div className="walk-duration">
  <span className="text_bar_3">Walk Duration:</span>
  </div>

  <div className="preference">
  <span className="text_bar_3">Preference:</span>
  </div>

  <div className="gain-route">
    <button className="gainroute-button">Gain a Route also checking if Github works!!</button>
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
          <Map></Map>
        </div>
      </div>
    </div>
  );
}

export default App;
