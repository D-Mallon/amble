import React, { useRef, useEffect, useState,useContext } from 'react';
import {Link, useNavigate} from 'react-router-dom';

import { createTheme,ThemeProvider  } from '@mui/material/styles';
import MenuBar2 from './MenuBar2';
import './HomePage2.css';
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
  


  function Resources() {
    return (
      <div className='landing-page-container'>
      <div className='menubar-area'>
      <MenuBar2 />
      </div>
      <div className='resources-pics-container'>
      <div className='left-color-block'>
      <span className='hometext-title'> 
          <span style={{ fontSize: '36px' ,fontWeight: 500}}>amble  <br></br>- the peaceful way</span>
          <br></br>
          <br></br>
          <br></br>
          </span>



          <div  className='home-button-container'>
          <MyButton/>
          </div>
      </div>
      </div>
      {/* <div className='mapwrapper_landingpage'>
          <MapBackground  zoom={12
          }/>
        </div> */}

        <div className='endbar'></div>
        </div>
    );
  }
  export default Resources;