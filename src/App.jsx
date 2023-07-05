import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";

import Interface from "./components/Interface";
import Login from "./components/login";
import RouteInputs from "./components/latlondis";

// If a route can not be displayed this function is invoked from Route path
function MatchAllRoute() {
  return <h2>The requested page does not exist</h2>;
}

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

          <Route path="*" element={<MatchAllRoute />} />

        </Routes>
    	</Router >
    </div >
  );
}

export default App;