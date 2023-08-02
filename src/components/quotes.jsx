import React, { useRef, useEffect, useState,useContext } from 'react';
import {Link, useNavigate} from 'react-router-dom';

import { createTheme,ThemeProvider  } from '@mui/material/styles';
import MenuBar2 from './MenuBar2';
import './quotes.css';
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
        <br></br>
        <br></br>
      
            <div className="quote">
              <h2>{quote}</h2>
              <small>- {author}</small>
            </div>

           

            <div className="wrapper-function-quote" >
          <a
            className="wrapper-function-text-quote"
            onClick={GetNewQuote}
            href="#"
            type="submit"
          >
            <span>Get a reflection</span>
          </a>
        </div>
            <br></br>
          </div>
    );
  }
  export default Quotes;