import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";

import Interface from "./components/Interface";
import Login from "./components/login";
import Comms from "./components/Comms.jsx";

function App() {

  const [inputValues, setInputValues] = useState({
    latitude: 0,
    longitude: 0,
  });

  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Interface />} />
          <Route path="/login" element={<Login />} />
          <Route path="/comms" element={<Comms />} />
        </Routes>
    	</Router >
    </div >
  );
}

export default App;