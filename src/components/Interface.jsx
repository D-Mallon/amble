import React, { useRef, useEffect, useState } from 'react';
import "./Interface.css";

import Map from "./Map";
import StartPlace from "./start_place";

function Interface({ inputValues, setInputValues }) {

  return (
    <div>
      <div className="interface-container">
        {/* <div className="user-input">
          <StartPlace inputValues={inputValues} setInputValues={setInputValues} />
        </div> */}
        <div className="map-container">
          <Map inputValues={inputValues} setInputValues={setInputValues} />
        </div>
      </div>
    </div >
  );
}

export default Interface;