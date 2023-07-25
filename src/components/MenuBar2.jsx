import React, { useState, useRef, useEffect } from "react";
import "./MenuBar2.css";
import {Link, useNavigate} from 'react-router-dom';
import { createTheme,ThemeProvider  } from '@mui/material/styles';
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StyleRoundedIcon from "@mui/icons-material/StyleRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Login from './login.jsx';

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

  const logoImages = [
    
    '/static/images/LO1.png',
    // '/static/images/LO2.png',
    // '/static/images/LO3.png',
    // '/static/images/LO4.png',
    // '/static/images/LO5.png',
    // '/static/images/LO6.png',
    // '/static/images/LO7.png',
    // '/static/images/LO8.png',
   
    // Add more logo image paths here if needed
  ];
  

export default function MenuBar2() {
    const navigate=useNavigate();
    const [logoIndex, setLogoIndex] = useState(0);

    const handleButtonClick = () =>{
        navigate('/interface-two')
    }

    const handleButtonClick2 = () =>{
      navigate('/landingpage')
  }

    useEffect(() => {
      const interval = setInterval(() => {
        setLogoIndex((prevIndex) => (prevIndex + 1) % logoImages.length);
      }, 10000); // Change logo every 3 seconds (adjust this interval as needed)
  
      return () => {
        clearInterval(interval);
      };
    }, []);
    return (
        <ThemeProvider theme={theme}>
        <div className="menubar2">
          <div className="logo-wrapper">
            <img src={logoImages[logoIndex]} className='Logo-amble' alt='Logo' onClick={handleButtonClick2}/>
          </div>
          <div className="menu-items">
            <div className="menu-item" onClick={handleButtonClick}>Create an amble</div>
            <div className="menu-item">Resources</div>
            <div className="menu-item">Login/Register</div>
          </div>
        </div>
        </ThemeProvider>
      );
    };
  