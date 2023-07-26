import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { MapInputProvider } from './context/MapInputContext';
import { ArrayProvider } from "./context/ArrayProvider";
import "./App.css";

import Interface from "./components/Interface";
import Login from "./components/login";
import LoginCheck from "./components/loginCheck";
import UserPreferences from "./components/userpref";
import ChatBox from "./components/ChatBox";
import Comms from "./components/Comms.jsx";
// import Quotes from './components/quotes';
import Resources from './components/resources';

import HomePage from './components/HomePage';
import Interface2 from './components/interface2';
import ShowRoute from './components/ShowRoute';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Account from './components/Account';
import { AuthContextProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './components/HomePage2';

// If a route can not be displayed this function is invoked from Route path
function MatchAllRoute() {
  return <h2>The requested page does not exist</h2>;
}

function App() {
  return (
    <div>
      <Router>
        <ArrayProvider> 
        <AuthContextProvider>
          <MapInputProvider>
            <Routes>
              <Route exact path="/" element={<LandingPage />} />
              <Route exact path="/map" element={<Interface2 />} />
              <Route path="/login" element={<Login />} />
              <Route path="/loginCheck" element={<LoginCheck />} />
              <Route path="/userpref" element={<UserPreferences />} />
              <Route path="*" element={<MatchAllRoute />} />
              <Route path="/chatbox" element={<ChatBox  />} />
            	<Route path="/showroute" element={<ShowRoute />} />
              <Route path="/homepage" element={<HomePage />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/homepage" element={<HomePage />} />
              {/* <Route path="/quotes" element={<Quotes />} /> */}
              <Route path="/resources" element={<Resources />} />
              <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            </Routes>
          </MapInputProvider>
        </AuthContextProvider> 
        </ArrayProvider>
      </Router >
    </div >
  );
}

export default App;