import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";

import Interface from "./components/Interface";
import Login from "./components/login";
import Comms from "./components/Comms.jsx";

function App() {

  const [inputValues, setInputValues] = useState({
    startLatitude: -73.98786664009094,
    startLongitude: 40.74218481889335,
    endLatitude: 0,
    endLongitude: 0,
  });

  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Interface inputValues={inputValues} setInputValues={setInputValues} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/comms" element={<Comms />} />
        </Routes>
      </Router >
    </div >
  );
}

export default App;