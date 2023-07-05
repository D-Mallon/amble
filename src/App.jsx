import React, { useRef, useEffect, useState } from 'react';
import Map from "./components/Map";
import "./App.css";

import { createTheme } from '@mui/material/styles';
import StartPlace from "./components/start_place";
import StartTime from './components/start_time';
import Preference from './components/preference';
import Distance from './components/walk_distance';

import Login from "./components/login";
import RouteInputs from "./components/latlondis";

function App() {

  const [inputValues, setInputValues] = useState([40.73581157695216,
    -73.9904522895813,
    40.74218481889335,
    -73.98786664009094]);

  return (
<div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Interface />} />
          <Route path="/login" element={<Login />} />
          <Route path="/latlondis" element={<RouteInputs />} />
        </Routes>
    	</Router >
</div >
  );
}

export default App;


