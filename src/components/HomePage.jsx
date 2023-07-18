import React, { useRef, useEffect, useState,useContext } from 'react';
import {Link, useNavigate} from 'react-router-dom';
const reactLogo = "react.svg";
const viteLogo = "vite.svg";

// import StartPlace from "./components/start_place";

import { createTheme,ThemeProvider  } from '@mui/material/styles';

import MenuAppBar from './MenuBar';
import './HomePage.css';
import MyButton from './mainbutton';
import MyFunctionButton from './functionbutton';
import MapBackground from './mapbackground';

const theme = createTheme({
    palette: {
      primary: {
        main: '#004d40',
      },
      secondary: {
        main: '#004d40',
      },
    },
  });
  
  function HomePage() {
    const navigate=useNavigate();

    const handleButtonClick = () =>{
        navigate('/interface')
    }

    return (
      <>
        <MenuAppBar />

        <div className='mapwrapper_homepage'>
        <MapBackground/>
        </div>
        {/* <img src="/static/images/logo.png" className='Logo' alt='Logo'/> */}
        <MyButton onClick={handleButtonClick}/>
        {/* <MyFunctionButton/> */}
       
      </>
    );
  }

  export default HomePage;