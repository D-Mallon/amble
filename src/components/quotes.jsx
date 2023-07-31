import React, { useRef, useEffect, useState,useContext } from 'react';
import {Link, useNavigate} from 'react-router-dom';

import { createTheme,ThemeProvider  } from '@mui/material/styles';
import MenuBar2 from './MenuBar2';
import './resources.css';
import MyButton from './mainbutton';
import MyFunctionButton from './functionbutton';
import MapBackground from './mapbackground';

import axios from 'axios';

function Quotes() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    GetNewQuote();
    }, []);

  let GetNewQuote = () => {
        axios.get('users/getquote')
        .then((response) => {
        const quotationsData = response.data;
        const quoteAuthors = Object.keys(quotationsData);
        // console.log(quoteAuthors)
        const randomIndex = Math.floor(Math.random() * quoteAuthors.length);
        const randomAuthor = quoteAuthors[randomIndex];
        const randomQuote = quotationsData[randomAuthor];
        setQuote(randomQuote);
        setAuthor(randomAuthor);
        })
        .catch((error) => {
        console.error('Error fetching data:', error);
    });
};

const theme = createTheme({
  palette: {
    primary: {main: '#004d40',},
    secondary: {main: '#004d40',},
  },
});
  
    return (
      <div className="landing-page-container">
        <div className="menubar-area">
          <MenuBar2 />
        </div>
        <br></br>
        <br></br>
        {/* <div className="imagequote-container">
            </div> */}
      
            <div className="quote">
              <h2>{quote}</h2>
              <small>- {author}</small>
            </div>

            <div className="btn-container">
              <button className="btn" onClick={GetNewQuote}>Get a reflection</button>
            </div>
            <br></br>
          </div>
    );
  }
  export default Quotes;