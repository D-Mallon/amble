import React, { useRef, useEffect, useState } from 'react';
import Map from "./Map";
import "./Interface.css";

import { createTheme } from '@mui/material/styles';
import StartPlace from "./start_place";
import StartTime from './start_time';
import Preference from './preference';
import Distance from './walk_distance';

function Interface({ inputValues, setInputValues }) {

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
            <StartPlace inputValues={inputValues} setInputValues={setInputValues} />
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
          <Map inputValues={inputValues} />
        </div>
      </div>
    </div >
  );
}

export default Interface;