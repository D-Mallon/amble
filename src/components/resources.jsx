import React, { useRef, useEffect, useState,useContext } from 'react';

import Quotes from './quotes';
import ChatGPT from './chatgpt';
import './resources.css';

import {Link, useNavigate} from 'react-router-dom';
import { createTheme,ThemeProvider  } from '@mui/material/styles';
import MenuBar2 from './MenuBar2';
import MyButton from './mainbutton';
import MyFunctionButton from './functionbutton';
import MapBackground from './mapbackground';
import Box from "@mui/material/Box";

const Resources = () => {
    return (
      <div>
        <Quotes />
        <ChatGPT />
      </div>
    );
  };
  
  export default Resources;